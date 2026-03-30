# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
# The asterisk covers both bun.lockb and the newer bun.lock
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set Build-time environment variables (Next.js needs these)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Important for Next.js standalone output
ENV NEXT_PRIVATE_STANDALONE=true

# Skip env validation during build (secrets aren't available at build time)
ENV SKIP_ENV_VALIDATION=1

RUN bun run build

# Runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
CMD ["bun", "server.js"]
