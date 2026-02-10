'use client'

import { CircleHelp } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { useDictionary } from '../providers/dictionary-provider'

export function About() {
	const { dictionary } = useDictionary()

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='fixed bottom-0 right-2 z-50 sm:right-4'
				>
					<CircleHelp className='size-4 text-muted-foreground' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{dictionary.about.title}</DialogTitle>
				</DialogHeader>
				<div className='flex flex-col justify-center gap-4 text-sm text-muted-foreground'>
					<p>
						<span className='font-serif font-bold text-green-600 dark:text-green-500'>
							trac
							<span className='text-wood-950 dark:text-wood-100'>ky</span>
						</span>{' '}
						{dictionary.about.description}
					</p>
					<p>{dictionary.about.purpose}</p>
					<p className='text-pretty'>
						{dictionary.about.builtBy}{' '}
						<a
							href='https://www.fraineralex.dev'
							target='_blank'
							rel='noopener noreferrer'
							className='text-blue-500'
						>
							fraineralex
						</a>
						. {dictionary.about.sourceCode}{' '}
						<a
							href='https://github.com/fraineralex/tracky'
							target='_blank'
							rel='noopener noreferrer'
							className='text-blue-500'
						>
							{dictionary.about.github}
						</a>
						.
					</p>
					<p>
						{dictionary.about.contact}{' '}
						<a
							href='mailto:fraineralex2001@gmail.com'
							className='text-blue-500'
						>
							{dictionary.about.email}
						</a>{' '}
						{dictionary.about.or}{' '}
						<a
							href='https://x.com/fraineralex'
							target='_blank'
							rel='noopener noreferrer'
							className='text-blue-500'
						>
							{dictionary.landing.footer.twitter}
						</a>
						.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
