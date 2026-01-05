import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { db } from '~/server/db'
import { food } from '~/server/db/schema'
import { eq, isNull, or } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { AddMealButton } from './add-meal-button'
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag
} from 'next/cache'
import { getDictionary } from '~/get-dictionary'
import { type Locale, i18n } from '~/i18n-config'
import { FoodDataTable } from './food-data-table'

async function getFoodData(userId: string) {
	'use cache'
	cacheLife('max')
	cacheTag('food')
	return await db
		.select({
			id: food.id,
			name: food.name,
			protein: food.protein,
			kcal: food.kcal,
			fat: food.fat,
			carbs: food.carbs
		})
		.from(food)
		.where(or(isNull(food.userId), eq(food.userId, userId)))
}

export default async function FoodDialog({ lang }: { lang?: Locale }) {
	const user = await currentUser()
	if (!user) return <AddMealButton />
	const foodData = await getFoodData(user.id)
	const locale = lang && i18n.locales.includes(lang) ? lang : i18n.defaultLocale
	const dictionary = await getDictionary(locale)

	const labels = {
		name: dictionary.food.form.name,
		protein: dictionary.common.nutrition.protein,
		carbs: dictionary.common.nutrition.carbs,
		fat: dictionary.common.nutrition.fat,
		calories: dictionary.common.nutrition.calories,
		servingSize: dictionary.food.form.servingSize
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<AddMealButton />
			</DialogTrigger>
			<DialogContent className='rounded-lg px-0 md:min-w-80 md:max-w-3xl lg:max-w-4xl lg:px-5 xl:max-w-6xl'>
				<DialogHeader>
					<DialogTitle className='ps-4 pt-2 text-start md:ps-8'>
						{dictionary.food.addMealToDiary}
					</DialogTitle>
				</DialogHeader>

				<div className='mx-auto px-2 md:container'>
					<FoodDataTable data={foodData} labels={labels} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
