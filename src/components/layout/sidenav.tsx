'use client'

import { HouseIcon } from '../ui/icons'
import { Dumbbell, Ham, NotepadText, Settings } from 'lucide-react'
import SidenavButton from './sidenav-button'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useDictionary } from '../providers/dictionary-provider'
import { i18n } from '~/i18n-config'

export default function SideNav() {
	const { dictionary, locale } = useDictionary()
	const pathname = usePathname()

	// Check if we're on home or onboarding (with or without locale prefix)
	const isHome = pathname === '/' || pathname === `/${locale}`
	const isOnboarding =
		pathname === '/onboarding' || pathname === `/${locale}/onboarding`

	if (isHome || isOnboarding) return null

	// Build href with locale prefix if not default locale
	const getHref = (path: string) => {
		if (locale === i18n.defaultLocale) return path
		return `/${locale}${path}`
	}

	return (
		<nav className='flex shrink-0 flex-col items-center pt-5 md:w-[215px] md:items-start'>
			<article className='flex flex-row justify-between gap-x-4 gap-y-2 px-4 text-center md:flex-col md:px-6 md:text-left'>
				<SidenavButton
					label={dictionary.common.navigation.overview}
					href={getHref('/dashboard')}
					enabled
				>
					<HouseIcon className='h-5 w-5 md:h-4 md:w-4' />
				</SidenavButton>
				<SidenavButton
					label={dictionary.common.navigation.food}
					href={getHref('/food')}
					enabled
				>
					<Ham className='h-6 w-6 md:h-5 md:w-5' />
				</SidenavButton>
				<SidenavButton
					label={dictionary.common.navigation.exercise}
					href={getHref('/exercise')}
					enabled
				>
					<Dumbbell className='h-6 w-6 md:h-5 md:w-5' />
				</SidenavButton>
				<SidenavButton
					label={dictionary.common.navigation.diary}
					href={getHref('/diary')}
					enabled
				>
					<NotepadText className='h-6 w-6 md:h-5 md:w-5' />
				</SidenavButton>
				<SidenavButton
					label={dictionary.common.navigation.settings}
					href={getHref('/settings')}
					enabled
				>
					<Settings className='h-6 w-6 md:h-5 md:w-5' />
				</SidenavButton>
			</article>
		</nav>
	)
}
