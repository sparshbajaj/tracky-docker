'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { SignedIn } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useDictionary } from '../providers/dictionary-provider'
import { SUPPORT_EMAIL } from '~/constants'
import { i18n } from '~/i18n-config'

export default function NavLinks() {
	const { dictionary, locale } = useDictionary()
	const pathname = usePathname()

	// Check if we're on home (with or without locale prefix)
	const isHome = pathname === '/' || pathname === `/${locale}`
	if (!isHome) return null

	// Build href with locale prefix if not default locale
	const getHref = (path: string) => {
		if (locale === i18n.defaultLocale) return path
		return `/${locale}${path}`
	}

	return (
		<article className='hidden space-x-4 pt-3 text-sm text-foreground sm:flex'>
			<Button
				variant='link'
				asChild
				title={dictionary.common.navigation.homePageTitle}
				aria-label={dictionary.common.navigation.homePageTitle}
			>
				<Link
					href={getHref('/')}
					className='underline decoration-2 underline-offset-[6px]'
				>
					{dictionary.common.navigation.home}
				</Link>
			</Button>
			<SignedIn>
				<Button
					variant='link'
					asChild
					title={dictionary.common.navigation.dashboardPageTitle}
					aria-label={dictionary.common.navigation.dashboardPageTitle}
				>
					<Link href={getHref('/dashboard')} className=''>
						{dictionary.common.navigation.dashboard}
					</Link>
				</Button>
			</SignedIn>
			<Button
				variant='link'
				asChild
				title={dictionary.common.navigation.contactTitle}
				aria-label={dictionary.common.navigation.contactTitle}
			>
				<Link href={`mailto:${SUPPORT_EMAIL}`} className=''>
					{dictionary.common.navigation.contact}
				</Link>
			</Button>
		</article>
	)
}
