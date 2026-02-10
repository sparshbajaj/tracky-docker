'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Languages } from 'lucide-react'
import { useDictionary } from '../providers/dictionary-provider'
import { i18n, type Locale } from '~/i18n-config'

const languageNames: Record<Locale, string> = {
	en: 'English',
	es: 'Español'
}

export function LanguageSwitcher() {
	const { locale, dictionary } = useDictionary()
	const pathname = usePathname()
	const router = useRouter()

	const switchLocale = (newLocale: Locale) => {
		if (newLocale === locale) return

		// Remove current locale prefix from pathname if present
		let pathWithoutLocale = pathname
		for (const loc of i18n.locales) {
			if (pathname.startsWith(`/${loc}/`)) {
				pathWithoutLocale = pathname.slice(loc.length + 1)
				break
			} else if (pathname === `/${loc}`) {
				pathWithoutLocale = '/'
				break
			}
		}

		// Build new path with new locale
		let newPath: string
		if (newLocale === i18n.defaultLocale) {
			// For default locale (en), don't add prefix
			newPath = pathWithoutLocale
		} else {
			// For non-default locale, add prefix
			newPath =
				pathWithoutLocale === '/'
					? `/${newLocale}`
					: `/${newLocale}${pathWithoutLocale}`
		}

		router.push(newPath)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='relative border-transparent bg-background'
					title={dictionary.common.switchLanguage}
				>
					<Languages className='h-5 w-5' />
					<span className='sr-only'>{dictionary.common.switchLanguage}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{i18n.locales.map(loc => (
					<DropdownMenuItem
						key={loc}
						onClick={() => switchLocale(loc)}
						className={locale === loc ? 'bg-accent' : ''}
					>
						{languageNames[loc]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
