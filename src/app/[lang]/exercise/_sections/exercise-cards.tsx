'use cache'

import { Activity, Clock, Flame, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
	calculateAdjustedDay,
	calculateDuration,
	round
} from '~/lib/calculations'
import { formatNumber } from '~/lib/utils'
import { type ExerciseMetricsData, type ExerciseCall } from '~/types'

interface ExerciseCardsLabels {
	totalEnergyBurned: string
	totalExerciseTime: string
	avgSessionDuration: string
	exercisesThisWeek: string
	times: string
	kcal: string
}

export default async function ExerciseCards({
	exercises: exercisesPromise,
	labels
}: {
	exercises: Promise<ExerciseCall>
	labels: ExerciseCardsLabels
}) {
	const exercises = await exercisesPromise

	const metrics: ExerciseMetricsData = {
		totalEnergyBurned: 0,
		totalDuration: 0,
		exercisesThisWeek: 0,
		avgDuration: 0
	}

	const dayOfWeek = new Date()
	dayOfWeek.setDate(dayOfWeek.getDate() - calculateAdjustedDay(dayOfWeek) - 1)

	for (const exercise of exercises) {
		metrics.totalEnergyBurned += Number(exercise.burned)
		metrics.totalDuration += Number(exercise.duration)

		if (exercise.createdAt >= dayOfWeek) metrics.exercisesThisWeek++
	}

	if (exercises.length > 0) {
		metrics.avgDuration = round(metrics.totalDuration / exercises.length)
	}

	const mainMetrics = [
		{
			name: labels.totalEnergyBurned,
			value: `${formatNumber(metrics.totalEnergyBurned)} ${labels.kcal}`,
			icon: Flame
		},
		{
			name: labels.totalExerciseTime,
			value: calculateDuration(metrics.totalDuration),
			icon: Clock
		},
		{
			name: labels.avgSessionDuration,
			value: calculateDuration(metrics.avgDuration),
			icon: TrendingUp
		},
		{
			name: labels.exercisesThisWeek,
			value: `${metrics.exercisesThisWeek.toLocaleString()} ${labels.times}`,
			icon: Activity
		}
	]

	return (
		<div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
			{mainMetrics.map(metric => (
				<Card
					key={metric.name}
					className='transition-shadow hover:shadow-lg dark:bg-slate-800/50'
				>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>{metric.name}</CardTitle>
						<metric.icon className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{metric.value}</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
