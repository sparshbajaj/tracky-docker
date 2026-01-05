'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Dictionary } from '~/get-dictionary'
import type { Locale } from '~/i18n-config'

interface DictionaryContextType {
	dictionary: Dictionary
	locale: Locale
}

const DictionaryContext = createContext<DictionaryContextType | null>(null)

export function DictionaryProvider({
	children,
	dictionary,
	locale
}: {
	children: ReactNode
	dictionary: Dictionary
	locale: Locale
}) {
	return (
		<DictionaryContext.Provider value={{ dictionary, locale }}>
			{children}
		</DictionaryContext.Provider>
	)
}

export function useDictionary() {
	const context = useContext(DictionaryContext)
	if (!context) {
		throw new Error('useDictionary must be used within a DictionaryProvider')
	}
	return context
}
