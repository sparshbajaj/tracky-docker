'use client'

import AIChatDialog from '~/app/[lang]/food/_components/ai-chat-dialog'
import { describeEntryImage, logHealthAI } from '~/app/ai/_actions'
import { useDictionary } from '~/components/providers/dictionary-provider'
import { type ReactNode } from 'react'

export function Header({ exerciseDialog }: { exerciseDialog: ReactNode }) {
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
			<h1 className='hidden text-xl font-bold uppercase sm:block lg:text-2xl'>
				{today}
			</h1>
			<div className='flex w-full flex-wrap items-center gap-2 sm:w-auto'>
				{exerciseDialog}
				<AIChatDialog
					action={logHealthAI}
					placeholder={dictionary.exercise.aiChatPlaceholder}
					title={dictionary.exercise.chatWithAI}
					instruction={dictionary.exercise.aiChatInstruction}
					describeImage={describeEntryImage}
				/>
			</div>
		</div>
	)
}
