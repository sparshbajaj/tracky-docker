'use client'

import { DataTable } from '~/components/ui/data-table'
import { createColumns, type Food, type FoodColumnLabels } from './columns'

interface FoodDataTableProps {
	data: Food[]
	labels: FoodColumnLabels
	locale?: string
}

export function FoodDataTable({ data, labels, locale }: FoodDataTableProps) {
	const columns = createColumns(labels, locale)
	return <DataTable columns={columns} data={data} locale={locale} />
}
