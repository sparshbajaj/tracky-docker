'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Line,
	LineChart,
	Tooltip
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { CustomTooltip } from '../_components/custom-tooltip'
import {
	NutritionMetrics,
	NutritionMetricsPerDay,
	WeeklyNutrition,
	TrakedField
} from '~/types'
import {
	calculateAdjustedDay,
	calculateMacroPercentage,
	calculatePercentage,
	round
} from '~/lib/calculations'
import { daysOfWeek } from '~/constants'
import { useDictionary } from '~/components/providers/dictionary-provider'

export default function NutritionGraphic({
	nutritionMeatrics: nutrition,
	weightsChanges
}: {
	nutritionMeatrics: NutritionMetricsPerDay
	weightsChanges: TrakedField
}) {
	const { dictionary, locale } = useDictionary()
	const t = dictionary.food.graphics
	const dateLocale = locale === 'es' ? 'es-ES' : 'en-US'

	const nutritionWeek: WeeklyNutrition[] = Object.entries(nutrition).map(
		([key, nutritients]) => {
			return {
				name: daysOfWeek[Number(key)] ?? '',
				calories: round(nutritients.calories.consumed),
				protein: round(nutritients.protein.consumed),
				fats: round(nutritients.fats.consumed),
				carbs: round(nutritients.carbs.consumed)
			}
		}
	)

	const weekDay = calculateAdjustedDay(new Date())
	const todayNutrition = nutrition[weekDay] as NutritionMetrics
	const todayGoalData = [
		{
			name: dictionary.common.nutrition.calories,
			value: calculatePercentage(todayNutrition.calories)
		},
		{
			name: dictionary.common.nutrition.protein,
			value: calculatePercentage(todayNutrition.protein)
		},
		{
			name: dictionary.common.nutrition.carbs,
			value: calculatePercentage(todayNutrition.carbs)
		},
		{
			name: dictionary.common.nutrition.fat,
			value: calculatePercentage(todayNutrition.fats)
		}
	]

	const weekGoalNutrition = Object.values(nutrition).reduce((acc, day) => {
		acc.calories.consumed += day.calories.consumed
		acc.protein.consumed += day.protein.consumed
		acc.fats.consumed += day.fats.consumed
		acc.carbs.consumed += day.carbs.consumed

		acc.calories.needed += day.calories.needed
		acc.protein.needed += day.protein.needed
		acc.fats.needed += day.fats.needed
		acc.carbs.needed += day.carbs.needed
		return acc
	})

	const weekGoalData = [
		{
			name: dictionary.common.nutrition.calories,
			value: calculatePercentage(weekGoalNutrition.calories)
		},
		{
			name: dictionary.common.nutrition.protein,
			value: calculatePercentage(weekGoalNutrition.protein)
		},
		{
			name: dictionary.common.nutrition.carbs,
			value: calculatePercentage(weekGoalNutrition.carbs)
		},
		{
			name: dictionary.common.nutrition.fat,
			value: calculatePercentage(weekGoalNutrition.fats)
		}
	]

	const macroData = [
		{
			name: dictionary.common.nutrition.protein,
			value: calculateMacroPercentage(
				todayNutrition.protein.consumed,
				todayNutrition.calories.consumed
			)
		},
		{
			name: dictionary.common.nutrition.carbs,
			value: calculateMacroPercentage(
				todayNutrition.carbs.consumed,
				todayNutrition.calories.consumed
			)
		},
		{
			name: dictionary.common.nutrition.fat,
			value: calculateMacroPercentage(
				todayNutrition.fats.consumed,
				todayNutrition.calories.consumed
			)
		}
	]

	const weightData = weightsChanges.map(({ value, date }) => ({
		name: new Date(date).toLocaleDateString(dateLocale, {
			day: 'numeric',
			month: 'short'
		}),
		weight: value
	}))

	return (
		<Tabs
			defaultValue='weekly'
			className='space-y-16 sm:space-y-12 md:space-y-8 xl:space-y-2'
		>
			<TabsList className='flex w-fit flex-wrap justify-start bg-background lg:bg-primary/5'>
				<TabsTrigger
					value='weekly'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					{t.tabs.weeklyTrends}
				</TabsTrigger>
				<TabsTrigger
					value='weight'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					{t.tabs.weightChanges}
				</TabsTrigger>
				<TabsTrigger
					value='macro'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					{t.tabs.macronutrients}
				</TabsTrigger>
				<TabsTrigger
					value='goalsToday'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					{t.tabs.goalToday}
				</TabsTrigger>
				<TabsTrigger
					value='goalsWeek'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					{t.tabs.goalWeek}
				</TabsTrigger>
			</TabsList>
			<TabsContent value='weekly' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							{t.weeklyNutritionalTrends}
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<LineChart data={nutritionWeek}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value}`}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Line
									type='monotone'
									dataKey='calories'
									stroke='#3b82f6'
									strokeWidth={2}
									name={dictionary.common.nutrition.calories}
								/>
								<Line
									type='monotone'
									dataKey='protein'
									stroke='#f43f5e'
									strokeWidth={2}
									name={dictionary.common.nutrition.protein}
								/>
								<Line
									type='monotone'
									dataKey='fats'
									stroke='#fbbf24'
									strokeWidth={2}
									name={dictionary.common.nutrition.fats}
								/>
								<Line
									type='monotone'
									dataKey='carbs'
									stroke='#4ade80'
									strokeWidth={2}
									name={dictionary.common.nutrition.carbs}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='weight' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							{t.weightChangesTitle}
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<LineChart data={weightData}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value} ${dictionary.common.units.kg}`}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Line
									type='monotone'
									dataKey='weight'
									stroke='#10b981'
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='macro' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							{t.macronutrientDistribution}
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<BarChart data={macroData}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value}%`}
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar dataKey='value' fill='#3b82f6' radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='goalsToday' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							{t.todayGoalCompletion}
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<BarChart data={todayGoalData}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value}%`}
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar dataKey='value' fill='#4ade80' radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='goalsWeek' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							{t.weekGoalCompletion}
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<BarChart data={weekGoalData}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value}%`}
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar dataKey='value' fill='#8b5cf6' radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
