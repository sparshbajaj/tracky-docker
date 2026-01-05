'use client'

import { Calendar, Filter } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { EntryType } from '~/types/diary'
import { useDictionary } from '~/components/providers/dictionary-provider'

export function Header({
	availableDates,
	selectedTypes,
	setSelectedTypes,
	setSelectedDate,
	setSelectedDiaryGroup
}: {
	availableDates: string[]
	selectedTypes: EntryType[]
	setSelectedTypes: (entryType: EntryType[]) => void
	setSelectedDate: (date: string) => void
	setSelectedDiaryGroup: (diaryGroup: string) => void
}) {
	const { dictionary } = useDictionary()
	const t = dictionary.diary

	const toggleEntryType = (type: EntryType) => {
		const newTypes = selectedTypes.includes(type)
			? selectedTypes.filter(t => t !== type)
			: [...selectedTypes, type]
		setSelectedTypes(newTypes)
	}

	const getEntryTypeLabel = (
		type: 'meal' | 'exercise' | 'food' | 'updates'
	) => {
		return t.types[type]
	}

	return (
		<header className='rounded-lg border border-muted-foreground/20 p-6 shadow-lg'>
			<h2 className='mb-6 flex items-center text-2xl font-semibold'>
				<Filter className='mr-2 h-6 w-6' />
				{t.filters}
			</h2>
			<div className='flex flex-wrap gap-6'>
				<div className='flex-grow space-y-2'>
					<h3 className='mb-2 text-sm font-medium'>{t.entryTypes}</h3>
					<div className='flex gap-2 md:flex-wrap'>
						{(['meal', 'exercise', 'food', 'updates'] as const).map(type => (
							<Button
								key={type}
								variant={selectedTypes.includes(type) ? 'default' : 'outline'}
								size='sm'
								onClick={() => toggleEntryType(type)}
								className='capitalize'
							>
								{getEntryTypeLabel(type)}
							</Button>
						))}
					</div>
				</div>
				<div className='space-y-2'>
					<h3 className='mb-2 text-sm font-medium'>{t.date}</h3>
					<Select onValueChange={setSelectedDate}>
						<SelectTrigger className='w-[200px]'>
							<Calendar className='mr-2 h-4 w-4' />
							<SelectValue placeholder={t.selectDate} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>{t.allDates}</SelectItem>
							{availableDates.map(date => (
								<SelectItem key={date} value={date}>
									{date}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<h3 className='mb-2 text-sm font-medium'>{t.diaryGroup}</h3>
					<Select onValueChange={setSelectedDiaryGroup}>
						<SelectTrigger className='w-[200px]'>
							<SelectValue placeholder={t.selectDiaryGroup} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>{t.allDiaryGroups}</SelectItem>
							<SelectItem value='breakfast'>
								{dictionary.common.meals.breakfast}
							</SelectItem>
							<SelectItem value='lunch'>
								{dictionary.common.meals.lunch}
							</SelectItem>
							<SelectItem value='snack'>
								{dictionary.common.meals.snack}
							</SelectItem>
							<SelectItem value='dinner'>
								{dictionary.common.meals.dinner}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</header>
	)
}
