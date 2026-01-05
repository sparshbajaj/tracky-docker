'use client'

import { Dumbbell } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useDictionary } from '~/components/providers/dictionary-provider'

export function AddExerciseButton() {
	const { dictionary } = useDictionary()
	return (
		<Button size='sm' className='flex-grow sm:flex-grow-0'>
			<Dumbbell className='mr-2 h-4 w-4' /> {dictionary.exercise.addExercise}
		</Button>
	)
}
