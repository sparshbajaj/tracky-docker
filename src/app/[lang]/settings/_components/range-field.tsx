'use client'

import React from 'react'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Slider } from '~/components/ui/slider'
import { type SettingsAttr } from '~/types'
import { useDictionary } from '~/components/providers/dictionary-provider'

export function RangeField({ attr }: { attr: SettingsAttr }) {
	const [newValue, setNewValue] = React.useState(attr.value as number)
	const { dictionary } = useDictionary()

	let progressValue = newValue
	if (attr.name !== 'exercise' && attr.max) {
		progressValue = (newValue / attr.max) * 100
	}
	return (
		<>
			<article>
				{attr.name === 'fat' ? (
					<Slider
						min={attr.min}
						max={attr.max}
						step={1}
						defaultValue={[newValue]}
						onValueChange={value => {
							if (value[0] !== undefined) {
								setNewValue(value[0])
							}
						}}
					/>
				) : (
					<Progress value={progressValue} max={attr.max} />
				)}
				<small className='text-muted-foreground'>
					{dictionary.settings.currentValue.replace(
						'{value}',
						String(newValue)
					)}
				</small>
			</article>
			{attr.name === 'fat' && (
				<Button
					type='submit'
					onClick={() => attr.updateValue?.(newValue)}
					disabled={newValue === attr.value}
				>
					{dictionary.common.save}
				</Button>
			)}
		</>
	)
}
