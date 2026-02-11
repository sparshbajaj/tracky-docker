'use client'

import * as React from 'react'
import { ClipboardList } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useDictionary } from '~/components/providers/dictionary-provider'

export const AddMealButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof Button>
>(function AddMealButton(props, ref) {
	const { dictionary } = useDictionary()
	return (
		<Button
			ref={ref}
			size='sm'
			className='flex-grow sm:flex-grow-0'
			{...props}
		>
			<ClipboardList className='mr-2 h-4 w-4' /> {dictionary.food.addMeal}
		</Button>
	)
})
