'use client'

import { Button } from '~/components/ui/button'
import { DialogClose } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { FoodState, registerFood } from '../_actions'
import { ShowErrors } from '~/components/forms/show-errors'
import { toast } from 'sonner'
import React from 'react'
import { useDictionary } from '~/components/providers/dictionary-provider'

const initialState: FoodState = {
	errors: {},
	message: '',
	success: false
}

export function RegisterFoodForm() {
	const [state, formAction] = React.useActionState(registerFood, initialState)
	const cancelBtnRef = React.useRef<HTMLButtonElement>(null)
	const { dictionary } = useDictionary()
	const t = dictionary.food.form

	React.useEffect(() => {
		if (state.success) {
			toast.success(dictionary.toast.success.foodRegistered)
			cancelBtnRef.current?.click()
		}
	}, [state, dictionary.toast.success.foodRegistered])

	return (
		<>
			<header className='text-center'>
				{state.message && !state.success && (
					<p className='text-sm font-semibold text-red-500'>{state.message}</p>
				)}
			</header>
			<form className='space-y-4' action={formAction}>
				<div className='space-y-2'>
					<Label htmlFor='name'>{t.name}</Label>
					<Input name='name' placeholder={t.namePlaceholder} required />
					<ShowErrors errors={state.errors?.name} />
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='calories'>{t.calories}</Label>
						<Input
							name='kcal'
							type='number'
							placeholder={t.caloriesPlaceholder}
							required
						/>
						<ShowErrors errors={state.errors?.kcal} />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='protein'>{t.protein}</Label>
						<Input
							name='protein'
							type='number'
							step='0.1'
							placeholder={t.proteinPlaceholder}
							required
						/>
						<ShowErrors errors={state.errors?.protein} />
					</div>
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='carbs'>{t.carbs}</Label>
						<Input
							name='carbs'
							type='number'
							step='0.1'
							placeholder={t.carbsPlaceholder}
							required
						/>
						<ShowErrors errors={state.errors?.carbs} />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='fats'>{t.fats}</Label>
						<Input
							name='fat'
							type='number'
							step='0.1'
							placeholder={t.fatsPlaceholder}
							required
						/>
					</div>
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='serving-size'>{t.servingSize}</Label>
						<Input
							name='servingSize'
							type='number'
							step='0.1'
							placeholder={t.servingSizePlaceholder}
							defaultValue={100}
							required
						/>
						<ShowErrors errors={state.errors?.servingSize} />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='serving-unit'>{t.servingUnit}</Label>
						<Select required name='unit' defaultValue='g'>
							<SelectTrigger name='serving-unit'>
								<SelectValue placeholder={t.selectUnit} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='g'>{dictionary.common.units.g}</SelectItem>
								<SelectItem value='ml'>{dictionary.common.units.ml}</SelectItem>
								<SelectItem value='oz'>{dictionary.common.units.oz}</SelectItem>
								<SelectItem value='cup'>
									{dictionary.common.units.cup}
								</SelectItem>
							</SelectContent>
						</Select>
						<ShowErrors errors={state.errors?.unit} />
					</div>
				</div>
				<div className='flex justify-end space-x-2 pt-4'>
					<DialogClose asChild>
						<Button type='button' variant='outline' ref={cancelBtnRef}>
							{dictionary.common.cancel}
						</Button>
					</DialogClose>
					<Button type='submit'>{dictionary.common.register}</Button>
				</div>
			</form>
		</>
	)
}
