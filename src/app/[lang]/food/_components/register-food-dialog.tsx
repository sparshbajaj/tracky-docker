'use client'

import { Button } from '~/components/ui/button'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import { RegisterFoodForm } from './resgister-food-form'
import { useDictionary } from '~/components/providers/dictionary-provider'

export default function RegisterFoodDialog() {
	const { dictionary } = useDictionary()

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' className='flex-grow sm:flex-grow-0'>
					<PlusCircle className='mr-2 h-4 w-4' /> {dictionary.food.registerFood}
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-[95%] rounded-lg md:max-w-md lg:max-w-lg'>
				<DialogHeader>
					<DialogTitle>{dictionary.food.registerNewFood}</DialogTitle>
					<DialogDescription>
						{dictionary.food.registerDescription}
					</DialogDescription>
				</DialogHeader>
				<RegisterFoodForm />
			</DialogContent>
		</Dialog>
	)
}
