'use client'

import React from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { SettingsAttr } from '~/types'
import { useDictionary } from '~/components/providers/dictionary-provider'

export function NumberField({ attr }: { attr: SettingsAttr }) {
	const [newValue, setNewValue] = React.useState(attr.value as number)
	const { dictionary } = useDictionary()

	return (
		<>
			<article>
				<Input
					type='number'
					placeholder={attr.placeholder}
					value={newValue}
					onChange={e => setNewValue(Number(e.target.value))}
				/>
			</article>
			<Button
				type='submit'
				onClick={() => attr.updateValue?.(newValue)}
				disabled={newValue === attr.value}
			>
				{dictionary.common.save}
			</Button>
		</>
	)
}
