'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { useDictionary } from '../providers/dictionary-provider'

export function ModeToggle() {
	const { setTheme } = useTheme()
	const { dictionary } = useDictionary()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='relative me-1 border-transparent bg-background'
					title={dictionary.theme.toggleTheme}
				>
					<Sun className='h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<Moon className='absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>{dictionary.theme.toggleTheme}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => setTheme('light')}>
					{dictionary.theme.light}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					{dictionary.theme.dark}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					{dictionary.theme.system}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
