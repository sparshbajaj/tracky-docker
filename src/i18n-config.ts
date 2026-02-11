export const i18n = {
	defaultLocale: 'en',
	locales: ['en', 'es']
} as const

export type Locale = (typeof i18n)['locales'][number]

export function pathWithLocale(path: string, locale: Locale): string {
	if (locale === i18n.defaultLocale) return path
	return `/${locale}${path}`
}

export function getLocaleFromPathname(pathname: string): Locale {
	const segment = pathname.split('/')[1] as Locale
	if (
		segment &&
		i18n.locales.includes(segment) &&
		segment !== i18n.defaultLocale
	)
		return segment as Locale
	return i18n.defaultLocale
}
