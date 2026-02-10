import { currentUser } from '@clerk/nextjs/server'
import {
	NutritionCardsSkeleton,
	NutritionGraphicsSkeleton
} from '../_components/skeletons'
import { NutritionCards } from './nutrition-cards'
import { Suspense } from 'react'
import { NutritionGraphicData } from '../_components/nutrition-graphic-data'
import { connection } from 'next/server'
import { type Locale } from '~/i18n-config'

export async function FoodMeatrics({ lang }: { lang: Locale }) {
	await connection()
	const user = currentUser()
	return (
		<>
			<Suspense fallback={<NutritionCardsSkeleton />}>
				<NutritionCards user={user} lang={lang} />
			</Suspense>
			<Suspense fallback={<NutritionGraphicsSkeleton />}>
				<NutritionGraphicData user={user} />
			</Suspense>
		</>
	)
}
