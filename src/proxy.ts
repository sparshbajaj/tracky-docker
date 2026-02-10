import { createRouteMatcher, clerkMiddleware } from '@clerk/nextjs/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])
const isOnboardingRoute = createRouteMatcher(['/onboarding'])

const clerkHandler = clerkMiddleware(async (auth, req) => {
	const { userId, sessionClaims, redirectToSignIn } = await auth()

	if (userId && isOnboardingRoute(req)) return NextResponse.next()

	if (!userId && !isPublicRoute(req))
		return redirectToSignIn({ returnBackUrl: req.url })

	if (userId && !sessionClaims?.metadata?.onboardingCompleted)
		return NextResponse.redirect(new URL('/onboarding', req.url))

	if (userId && !isPublicRoute(req)) return NextResponse.next()
})

export function proxy(request: NextRequest, event: NextFetchEvent) {
	return clerkHandler(request, event)
}

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
