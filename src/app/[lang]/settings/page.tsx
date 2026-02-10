import { Suspense } from 'react'
import { SettingItems } from './_sections/setting-items'
import { Metadata } from 'next'
import { SettingItemsSkeletonUI } from './_components/skeletons'
import Footer from '~/components/layout/footer'
import { connection } from 'next/server'
import { getDictionary } from '~/get-dictionary'
import { i18n, type Locale } from '~/i18n-config'

export const metadata: Metadata = {
	title: 'Settings'
}

export default async function SettingsPage({
	params
}: {
	params: Promise<{ lang: Locale }>
}) {
	await connection()
	const { lang } = await params
	const locale = i18n.locales.includes(lang) ? lang : i18n.defaultLocale
	const dictionary = await getDictionary(locale)

	return (
		<section className='container mx-auto py-5'>
			<header className='mb-8 flex flex-col gap-1'>
				<h1 className='text-2xl font-bold'>{dictionary.settings.title}</h1>
				<h2 className='text-sm text-muted-foreground'>
					{dictionary.settings.subtitle}
				</h2>
			</header>
			<Suspense fallback={<SettingItemsSkeletonUI />}>
				<SettingItems dictionary={dictionary} />
			</Suspense>
			<Footer className='fixed bottom-0 right-0 backdrop-blur-none' showAbout />
		</section>
	)
}
