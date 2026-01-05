'use client'

import { DataTable } from '~/components/ui/data-table'
import { createColumns, type Food, type FoodColumnLabels } from './columns'

interface FoodDataTableProps {
	data: Food[]
	labels: FoodColumnLabels
}

export function FoodDataTable({ data, labels }: FoodDataTableProps) {
	const columns = createColumns(labels)
	return <DataTable columns={columns} data={data} />
}
