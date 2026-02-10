import { type Metadata } from 'next'
import { Suspense } from 'react'
import { DiaryTimelineSkeletonUI } from './_components/skeletons'
import { DiaryTimelineData } from './_components/diary-timeline-data'
import { connection } from 'next/server'
import Footer from '~/components/layout/footer'
import { i18n, type Locale } from '~/i18n-config'

export const metadata: Metadata = {
	title: 'Diary'
}

export default async function DiaryPage({
	params
}: {
	params: Promise<{ lang: Locale }>
}) {
	await connection()
	const { lang } = await params
	const locale = i18n.locales.includes(lang) ? lang : i18n.defaultLocale

	const today = new Date().toLocaleDateString(
		locale === 'es' ? 'es-ES' : 'en-US',
		{
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		}
	)

	return (
		<section className='mx-auto min-h-screen w-full'>
			<div className='container mx-auto max-w-5xl px-4 py-8'>
				<h1 className='pb-4 text-2xl font-bold uppercase'>{today}</h1>
				<Suspense fallback={<DiaryTimelineSkeletonUI />}>
					<DiaryTimelineData lang={locale} />
				</Suspense>
			</div>
			<Footer className='fixed bottom-0 right-0 backdrop-blur-none' showAbout />
		</section>
	)
}
