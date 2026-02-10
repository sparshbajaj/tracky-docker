'use client'

import * as React from 'react'
import { Button } from '~/components/ui/button'
import {
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from '~/components/ui/drawer'
import { type Food } from './columns'
import { Card } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { toast } from 'sonner'
import { type ConsumptionState, addConsumption } from '../../_actions'
import FoodCardItem from './food-card'
import { ShowErrors } from '~/components/forms/show-errors'
import { useDictionary } from '~/components/providers/dictionary-provider'

const initialState: ConsumptionState = {
	message: '',
	errors: {},
	success: undefined
}

export function FoodDrawer({
	foodData,
	handleDrawerClose
}: {
	foodData: Food
	handleDrawerClose: () => void
}) {
	const { dictionary } = useDictionary()
	const [portion, setPortion] = React.useState('100')
	const [unit, setUnit] = React.useState<keyof typeof unitConversions>('g')
	const [mealGroup, setMealGroup] = React.useState('uncategorized')

	const [state, formAction, isPending] = React.useActionState(
		addConsumption,
		initialState
	)

	const unitConversions = {
		g: 1,
		ml: 0.001,
		oz: 28.3495,
		cup: 240
	}

	const portionInGrams = parseFloat(portion || '0') * unitConversions[unit]

	const adjustedCalories = (parseFloat(foodData.kcal) * portionInGrams) / 100
	const adjustedProtein = (parseFloat(foodData.protein) * portionInGrams) / 100
	const adjustedFat = (parseFloat(foodData.fat) * portionInGrams) / 100
	const adjustedCarbs = (parseFloat(foodData.carbs) * portionInGrams) / 100

	const roundToK = (value: number) =>
		value < 1000 ? value.toFixed(0) : `${(value / 1000).toFixed(0)}k`

	const handlePortionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPortion = e.target.value
		const portionInGrams = parseInt(newPortion) * unitConversions[unit]

		if (portionInGrams <= 10000) {
			setPortion(newPortion)
		} else {
			toast.error(dictionary.food.drawer.portionLimitError)
		}
	}
	React.useEffect(() => {
		if (state.success) {
			handleDrawerClose()
			toast.dismiss('consumption-form')
			toast.success(dictionary.aiChat.successMessages.consumptionAdded)
		}

		if (!state.success && isPending) {
			const promise = () =>
				new Promise(resolve =>
					setTimeout(() => resolve({ name: 'Sonner' }), 100000)
				)

			toast.promise(promise, {
				loading: dictionary.aiChat.loadingMessages.addingFood,
				id: 'consumption-form'
			})
		}
	}, [state, handleDrawerClose, isPending, dictionary])

	return (
		<DrawerContent className='min-w-80'>
			<div className='mx-auto w-full max-w-xl'>
				<DrawerHeader>
					<DrawerTitle className='text-center'>{foodData.name}</DrawerTitle>
					{state?.message && !state.success && (
						<DrawerDescription className='text-center text-red-500'>
							{state.message}
						</DrawerDescription>
					)}
				</DrawerHeader>
				<div className='mx-auto w-full max-w-md p-2 pb-0 sm:p-4'>
					<Card className='mx-auto border-0 bg-transparent shadow-none sm:ps-7'>
						<div className='mx-auto grid grid-cols-4 space-x-5'>
							<FoodCardItem
								item={{
									name: dictionary.common.nutrition.calories,
									value: roundToK(adjustedCalories),
									percent: null,
									balance: 'well',
									color: null
								}}
							/>
							<FoodCardItem
								item={{
									name: dictionary.common.nutrition.protein,
									value: roundToK(adjustedProtein),
									percent: (
										((adjustedProtein * 4) / adjustedCalories) * 100 || 0
									).toFixed(),
									color: 'bg-blue-500 dark:bg-blue-600'
								}}
							/>
							<FoodCardItem
								item={{
									name: dictionary.common.nutrition.fat,
									value: roundToK(adjustedFat),
									percent: (
										((adjustedFat * 9) / adjustedCalories) * 100 || 0
									).toFixed(),
									color: 'bg-purple-500 dark:bg-purple-600'
								}}
							/>
							<FoodCardItem
								item={{
									name: dictionary.common.nutrition.carbs,
									value: roundToK(adjustedCarbs),
									percent: (
										((adjustedCarbs * 4) / adjustedCalories) * 100 || 0
									).toFixed(),
									color: 'bg-orange-500 dark:bg-orange-600'
								}}
							/>
						</div>
					</Card>
					<form
						className='mt-10 w-full items-center bg-transparent px-2 sm:px-4 sm:ps-5'
						action={formAction}
					>
						<input type='hidden' name='foodId' value={foodData.id} />
						<aside className='flex justify-between pb-3'>
							<Label className='text-base font-semibold'>
								{dictionary.food.form.servingSize}
								<ShowErrors errors={state.errors?.portion} />
							</Label>
							<Label className='text-base font-semibold'>
								{dictionary.food.form.diaryGroup}
							</Label>
						</aside>
						<div className='flex items-center justify-between space-x-4'>
							<div className='min-w-0'>
								<Label htmlFor='portion' className='sr-only'>
									{dictionary.food.form.portion}
									<ShowErrors errors={state.errors?.unit} />
								</Label>
								<Input
									id='portion'
									name='portion'
									type='number'
									placeholder={dictionary.food.form.portion}
									value={portion}
									onChange={handlePortionChange}
									className='w-full max-w-24'
									required
								/>
							</div>
							<div className='min-w-0'>
								<Label htmlFor='unit' className='sr-only'>
									{dictionary.food.form.unit}
								</Label>
								<Select
									name='unit'
									value={unit}
									onValueChange={(value: string) =>
										setUnit(value as keyof typeof unitConversions)
									}
									required
								>
									<SelectTrigger id='unit'>
										<SelectValue placeholder={dictionary.food.form.unit} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='g'>
											{dictionary.food.units.grams}
										</SelectItem>
										<SelectItem value='ml'>
											{dictionary.food.units.milliliters}
										</SelectItem>
										<SelectItem value='oz'>
											{dictionary.food.units.ounces}
										</SelectItem>
										<SelectItem value='cup'>
											{dictionary.food.units.cups}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='min-w-0 '>
								<Label htmlFor='mealGroup' className='sr-only'>
									{dictionary.food.form.mealGroup}
								</Label>
								<Select
									value={mealGroup}
									onValueChange={setMealGroup}
									name='mealGroup'
									required
								>
									<SelectTrigger id='mealGroup'>
										<SelectValue placeholder={dictionary.food.form.mealGroup} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='breakfast'>
											{dictionary.common.meals.breakfast}
										</SelectItem>
										<SelectItem value='lunch'>
											{dictionary.common.meals.lunch}
										</SelectItem>
										<SelectItem value='dinner'>
											{dictionary.common.meals.dinner}
										</SelectItem>
										<SelectItem value='snack'>
											{dictionary.common.meals.snack}
										</SelectItem>
										<SelectItem value='uncategorized'>
											{dictionary.common.meals.uncategorized}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DrawerFooter className='mx-0 px-0'>
							<div className='flex justify-between space-x-5 py-5'>
								<DrawerClose asChild>
									<Button
										variant='outline'
										className='px-10 dark:border-gray-400 sm:px-16'
									>
										{dictionary.common.cancel}
									</Button>
								</DrawerClose>
								<Button className='px-10 sm:px-16'>
									{dictionary.common.add}
								</Button>
							</div>
						</DrawerFooter>
					</form>
				</div>
			</div>
		</DrawerContent>
	)
}
