import NutritionGraphic from '../sections/nutrition-graphics'
import { type User } from '@clerk/nextjs/server'
import { NutritionGraphicSkeleton } from '~/app/[lang]/dashboard/_components/skeletons'
import { getUserNutritionMetrics } from '~/server/utils/nutrition'

export async function NutritionGraphicData({
	user: currentUser
}: {
	user: Promise<User | null>
}) {
	const user = await currentUser
	if (!user) return <NutritionGraphicSkeleton />
	const nutritionMeatrics = await getUserNutritionMetrics(
		user.id,
		user.publicMetadata
	)
	return (
		<NutritionGraphic
			nutritionMeatrics={nutritionMeatrics}
			weightsChanges={user.publicMetadata.weights}
		/>
	)
}
