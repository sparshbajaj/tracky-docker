'use client'

import { SETTING_ICONS } from '~/constants'
import { Skeleton } from '~/components/ui/skeleton'
import { useDictionary } from '~/components/providers/dictionary-provider'

export function SettingItemsSkeletonUI() {
	const { dictionary } = useDictionary()
	return (
		<>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>
					{dictionary.settings.sections.personalInfo}
				</h2>
				<div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
					<MenuItemSkeletonUI
						name='born'
						label={dictionary.settings.fields.bornDate}
					/>
					<MenuItemSkeletonUI
						name='sex'
						label={dictionary.settings.fields.sex}
					/>
					<MenuItemSkeletonUI
						name='activity'
						label={dictionary.settings.fields.activity}
					/>

					<MenuItemSkeletonUI
						name='height'
						label={dictionary.settings.fields.height}
					/>
					<MenuItemSkeletonUI
						name='weights'
						label={dictionary.settings.fields.weight}
					/>
					<MenuItemSkeletonUI
						name='fat'
						label={dictionary.settings.fields.bodyFat}
					/>
				</div>
			</div>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>
					{dictionary.settings.sections.preferencesGoals}
				</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<MenuItemSkeletonUI
						name='goal'
						label={dictionary.settings.fields.goal}
					/>
					<MenuItemSkeletonUI
						name='goalWeight'
						label={dictionary.settings.fields.goalWeight}
					/>
					<MenuItemSkeletonUI
						name='progress'
						label={dictionary.settings.fields.goalProgress}
					/>
				</div>
			</div>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>
					{dictionary.settings.sections.supportInfo}
				</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<MenuItemSkeletonUI
						name='mail'
						label={dictionary.settings.support.reachOut}
						value={dictionary.settings.support.getTechnicalSupport}
					/>
					<MenuItemSkeletonUI
						name='about'
						label={dictionary.settings.support.about}
						value={dictionary.settings.support.learnMore}
					/>
					<MenuItemSkeletonUI
						name='healt'
						label={dictionary.settings.support.healthDisclaimer}
						value={dictionary.settings.support.understandGuidelines}
					/>
				</div>
			</div>
			<p className='mt-8 text-center text-sm text-muted-foreground'>
				{dictionary.common.version}
			</p>
		</>
	)
}

export function MenuItemSkeletonUI({
	name,
	label,
	value
}: {
	name: string
	label: string
	value?: string
}) {
	const Icon = SETTING_ICONS[name as keyof typeof SETTING_ICONS]
	return (
		<span className='inline-flex h-auto w-full items-center justify-start whitespace-nowrap rounded-md border border-input bg-background px-4 py-4 text-sm font-medium shadow-sm transition-colors'>
			<Icon className='mr-2 h-5 w-5' />
			<div className='flex flex-col items-start'>
				<span className='font-medium'>{label}</span>
				{value ? (
					<span className='text-sm capitalize text-muted-foreground'>
						{value}
					</span>
				) : (
					<Skeleton className='mt-[7px] h-3 w-20 md:w-28' />
				)}
			</div>
		</span>
	)
}
