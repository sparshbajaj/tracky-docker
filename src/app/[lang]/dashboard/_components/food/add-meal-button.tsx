'use client'

import { ClipboardList } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useDictionary } from '~/components/providers/dictionary-provider'

export function AddMealButton() {
	const { dictionary } = useDictionary()
	return (
		<Button size='sm' className='flex-grow sm:flex-grow-0'>
			<ClipboardList className='mr-2 h-4 w-4' /> {dictionary.food.addMeal}
		</Button>
	)
}
