'use client'

import * as React from 'react'
import { Dumbbell } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useDictionary } from '~/components/providers/dictionary-provider'

export const AddExerciseButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof Button>
>(function AddExerciseButton(props, ref) {
	const { dictionary } = useDictionary()
	return (
		<Button
			ref={ref}
			size='sm'
			className='flex-grow sm:flex-grow-0'
			{...props}
		>
			<Dumbbell className='mr-2 h-4 w-4' /> {dictionary.exercise.addExercise}
		</Button>
	)
})
