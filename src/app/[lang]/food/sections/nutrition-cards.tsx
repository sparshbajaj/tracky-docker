import { NutritionCard } from '../_components/nutrition-card'
import { User } from '@clerk/nextjs/server'
import { getTodayNutritionMetrics } from '~/server/utils/nutrition'
import { NutritionCardsSkeleton } from '../_components/skeletons'
import { getDictionary } from '~/get-dictionary'
import { Locale } from '~/i18n-config'

export async function NutritionCards({
	user: currentUser,
	lang
}: {
	user: Promise<User | null>
	lang: Locale
}) {
	const user = await currentUser
	if (!user) return <NutritionCardsSkeleton />
	const [nutrition, dictionary] = await Promise.all([
		getTodayNutritionMetrics(user.id, user?.publicMetadata),
		getDictionary(lang)
	])

	const nutritionLabels: { [key: string]: string } = {
		calories: dictionary.common.nutrition.calories,
		protein: dictionary.common.nutrition.protein,
		carbs: dictionary.common.nutrition.carbs,
		fats: dictionary.common.nutrition.fats
	}

	return (
		<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
			{Object.entries(nutrition).map(([key, value]) => (
				<NutritionCard
					key={key}
					nutrient={value}
					name={nutritionLabels[key] || key}
					iconKey={key}
					ofDailyGoalLabel={dictionary.food.card.ofDailyGoal}
				/>
			))}
		</div>
	)
}
