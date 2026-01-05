import { dirname } from 'path'
import { fileURLToPath } from 'url'
import tseslint from 'typescript-eslint'
import drizzle from 'eslint-plugin-drizzle'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default tseslint.config(
	// Ignore patterns
	{
		ignores: ['.next/**', 'node_modules/**', 'eslint.config.mjs']
	},

	// TypeScript type-checked rules
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,

	// TypeScript parser options and custom rules
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: __dirname
			}
		},
		plugins: {
			drizzle
		},
		rules: {
			// TypeScript rules
			'@typescript-eslint/array-type': 'off',
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports'
				}
			],
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: {
						attributes: false
					}
				}
			],

			// Drizzle rules
			'drizzle/enforce-delete-with-where': [
				'error',
				{
					drizzleObjectName: ['db', 'ctx.db']
				}
			],
			'drizzle/enforce-update-with-where': [
				'error',
				{
					drizzleObjectName: ['db', 'ctx.db']
				}
			]
		}
	}
)
