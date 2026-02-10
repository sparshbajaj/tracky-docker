import { Header } from './sections/header'
import { Metadata } from 'next'
import Footer from '~/components/layout/footer'
import { Suspense } from 'react'
import { FoodMeatricsSkeleton, HeaderSkeleton } from './_components/skeletons'
import { FoodMeatrics } from './sections/food-meatrics'
import { connection } from 'next/server'
import { i18n, type Locale } from '~/i18n-config'
import FoodDialog from '~/app/[lang]/dashboard/_components/food/food-dialog'
import { AddMealButton } from '~/app/[lang]/dashboard/_components/food/add-meal-button'

export const metadata: Metadata = {
	title: 'Food'
}

export default async function FoodPage({
	params
}: {
	params: Promise<{ lang: Locale }>
}) {
	await connection()
	const { lang } = await params
	const locale = i18n.locales.includes(lang) ? lang : i18n.defaultLocale

	return (
		<>
			<section className='container mx-auto px-0 py-5'>
				<Suspense fallback={<HeaderSkeleton />}>
					<Header
						foodDialog={
							<Suspense fallback={<AddMealButton />}>
								<FoodDialog lang={locale} />
							</Suspense>
						}
					/>
				</Suspense>
				<Suspense fallback={<FoodMeatricsSkeleton />}>
					<FoodMeatrics lang={locale} />
				</Suspense>
			</section>
			<Footer className='fixed bottom-0 right-0 backdrop-blur-none' showAbout />
		</>
	)
}
