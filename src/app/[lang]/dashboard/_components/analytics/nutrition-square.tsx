'use client'

import { Drumstick, Flame, Nut, Wheat } from 'lucide-react'
import React from 'react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '~/components/ui/tooltip'
import { round } from '~/lib/calculations'
import { type NutritionMetrics } from '~/types'
import { useDictionary } from '~/components/providers/dictionary-provider'

export function NutritionSquare({
	dayIndex,
	nutrientIndex,
	dayOfWeek,
	percentage,
	days,
	nutrient,
	nutritionDay
}: {
	dayIndex: number
	nutrientIndex: number
	dayOfWeek: number
	percentage: string
	days: string[]
	nutrient?: NutritionMetrics[keyof NutritionMetrics]
	nutritionDay?: NutritionMetrics
}) {
	const [open, setOpen] = React.useState(false)
	const { dictionary } = useDictionary()

	const daysText = [
		dictionary.common.days.monday,
		dictionary.common.days.tuesday,
		dictionary.common.days.wednesday,
		dictionary.common.days.thursday,
		dictionary.common.days.friday,
		dictionary.common.days.saturday,
		dictionary.common.days.sunday
	]
	const nutrientNames = [
		dictionary.common.nutrition.calories,
		dictionary.common.nutrition.protein,
		dictionary.common.nutrition.fats,
		dictionary.common.nutrition.carbs
	]
	const nutrientIcons = [
		<Flame key='flame' className='h-4 w-4' />,
		<Drumstick key='drumstick' className='h-4 w-4' />,
		<Nut key='nut' className='h-4 w-4' />,
		<Wheat key='wheat' className='h-4 w-4' />
	]
	const colors = [
		'text-red-300 dark:text-red-500',
		'text-blue-300 dark:text-blue-500',
		'text-yellow-300 dark:text-yellow-500',
		'text-green-300 dark:text-green-500'
	]

	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip open={open} onOpenChange={open => setOpen(open)}>
				<TooltipTrigger asChild>
					{dayIndex < 7 && nutrientIndex < 4 ? (
						<span
							className='pointer rounded-md px-4 py-4'
							key={dayIndex}
							style={{
								background: `linear-gradient(to top, hsl(var(--foreground) / ${dayIndex === dayOfWeek ? '0.9' : '0.5'}) ${percentage}%, hsl(var(--primary) / 0.2) ${percentage}%)`
							}}
							onClick={() => setOpen(!open)}
						></span>
					) : (
						<span
							className={`-ms-1 px-3 py-2 ${dayIndex === dayOfWeek ? 'rounded-md border-2 border-primary font-semibold' : ''}`}
							key={dayIndex}
							onClick={() => setOpen(!open)}
						>
							{days[dayIndex]}
						</span>
					)}
				</TooltipTrigger>
				<TooltipContent className='flex flex-col gap-1'>
					{dayIndex < 7 && nutrientIndex < 4 ? (
						<>
							<p
								className={`font-semibold ${colors[nutrientIndex]} flex space-x-1`}
							>
								{nutrientIcons[nutrientIndex]}
								<span>
									{nutrientNames[nutrientIndex]} {percentage}%
								</span>
							</p>
							<p className='flex space-x-1 text-gray-300 dark:text-gray-700'>
								<strong>{dictionary.common.nutrition.consumed}</strong>
								<span>
									{round(nutrient?.consumed).toLocaleString()} /{' '}
									{round(nutrient?.needed).toLocaleString()}{' '}
									{nutrientIndex === 0
										? dictionary.common.units.kcal
										: dictionary.common.units.g}
								</span>
							</p>
							<p className='flex space-x-1 text-gray-300 dark:text-gray-700'>
								<strong>{dictionary.common.nutrition.remaining}</strong>
								<span>
									{(nutrient?.needed ?? 0) > (nutrient?.consumed ?? 0)
										? round(
												(nutrient?.needed ?? 0) - (nutrient?.consumed ?? 0)
											).toLocaleString()
										: 0}{' '}
									{nutrientIndex === 0
										? dictionary.common.units.kcal
										: dictionary.common.units.g}
								</span>
							</p>
						</>
					) : (
						<article className='text-gray-300 dark:text-gray-700'>
							<p
								className={`font-semibold text-indigo-300 dark:text-indigo-500`}
							>
								{daysText[dayIndex]} {percentage}%
							</p>
							<p className='flex items-center space-x-1'>
								<Flame className='h-4 w-4 text-red-300 dark:text-red-500' />
								<strong>{dictionary.common.nutrition.calories}:</strong>{' '}
								<span>
									{round(nutritionDay?.calories.consumed).toLocaleString()} /{' '}
									{round(nutritionDay?.calories.needed).toLocaleString()}{' '}
									{dictionary.common.units.kcal}
								</span>
							</p>
							<p className='flex items-center space-x-1'>
								<Drumstick className='h-4 w-4 text-blue-300 dark:text-blue-500' />
								<strong>{dictionary.common.nutrition.protein}:</strong>{' '}
								<span>
									{round(nutritionDay?.protein.consumed).toLocaleString()} /{' '}
									{round(nutritionDay?.protein.needed).toLocaleString()}{' '}
									{dictionary.common.units.g}
								</span>
							</p>
							<p className='flex items-center space-x-1'>
								<Nut className='h-4 w-4 text-yellow-300 dark:text-yellow-500' />
								<strong>{dictionary.common.nutrition.fats}:</strong>{' '}
								<span>
									{round(nutritionDay?.fats.consumed).toLocaleString()} /{' '}
									{round(nutritionDay?.fats.needed).toLocaleString()}{' '}
									{dictionary.common.units.g}
								</span>
							</p>
							<p className='flex items-center space-x-1'>
								<Wheat className='h-4 w-4 text-green-300 dark:text-green-500' />
								<strong>{dictionary.common.nutrition.carbs}:</strong>{' '}
								<span>
									{round(nutritionDay?.carbs.consumed).toLocaleString()} /{' '}
									{round(nutritionDay?.carbs.needed).toLocaleString()}{' '}
									{dictionary.common.units.g}
								</span>
							</p>
						</article>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
