'use client'

import RegisterFoodDialog from '../_components/register-food-dialog'
import AIChatDialog from '../_components/ai-chat-dialog'
import { describeEntryImage, logHealthAI } from '~/app/ai/_actions'
import { useDictionary } from '~/components/providers/dictionary-provider'
import { type ReactNode } from 'react'

export function Header({ foodDialog }: { foodDialog: ReactNode }) {
	const { dictionary, locale } = useDictionary()

	const today = new Date().toLocaleDateString(
		locale === 'es' ? 'es-ES' : 'en-US',
		{
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		}
	)

	return (
		<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
			<h1 className='hidden text-2xl font-bold uppercase sm:block'>{today}</h1>
			<div className='flex w-full flex-wrap place-content-center place-items-center items-center gap-2 sm:w-auto'>
				<RegisterFoodDialog />
				{foodDialog}
				<AIChatDialog
					action={logHealthAI}
					placeholder={dictionary.food.aiChatPlaceholder}
					title={dictionary.food.chatWithAI}
					instruction={dictionary.food.aiChatInstruction}
					describeImage={describeEntryImage}
				/>
			</div>
		</div>
	)
}
