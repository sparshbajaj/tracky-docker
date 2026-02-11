'use client'

import * as React from 'react'
import {
	type ColumnDef,
	type PaginationState,
	type Row,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '~/components/ui/table'
import { Button } from './button'
import { Input } from './input'

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { FoodDrawer } from '~/app/[lang]/dashboard/_components/food/food-drawer'
import { Drawer, DrawerTrigger } from './drawer'
import { type Food } from '~/app/[lang]/dashboard/_components/food/columns'
import { DialogClose } from './dialog'
import { useDictionary } from '~/components/providers/dictionary-provider'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	locale?: string
}

export function DataTable<TData, TValue>({
	columns,
	data,
	locale
}: DataTableProps<TData, TValue>) {
	const { dictionary } = useDictionary()

	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	})
	const [selectedRow, setSelectedRow] = React.useState<Food | null>(null)
	const [filterValue, setFilterValue] = React.useState('')
	const normalizedFilter = filterValue.trim().toLowerCase()
	const filteredData = React.useMemo(() => {
		if (!normalizedFilter) return data
		return data.filter(row => {
			const r = row as { name?: string; nameEs?: string | null }
			const name = r.name
			const nameEs = r.nameEs
			const matchesName = typeof name === 'string' && name.toLowerCase().includes(normalizedFilter)
			const matchesNameEs = typeof nameEs === 'string' && nameEs.toLowerCase().includes(normalizedFilter)
			return locale === 'es' ? matchesName || matchesNameEs : matchesName
		})
	}, [data, normalizedFilter, locale])

	React.useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setColumnVisibility({
					fat: false,
					carbs: false,
					servingSize: false
				})
			} else if (window.innerWidth < 1024) {
				setColumnVisibility({
					servingSize: false
				})
			} else {
				setColumnVisibility({
					fat: true,
					carbs: true,
					servingSize: window.innerWidth > 1024 ? true : false
				})
			}
		}

		window.addEventListener('resize', handleResize)
		handleResize()

		return () => window.removeEventListener('resize', handleResize)
	}, [])
	const table = useReactTable({
		data: filteredData,
		columns,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
			columnVisibility,
			pagination
		}
	})

	const handleCellClick = (row: Row<TData>) => {
		const original = row.original as Partial<Food>
		const foodData: Food = {
			id: String(row.getValue('id')),
			name: String(row.getValue('name')),
			nameEs: typeof original.nameEs === 'string' ? original.nameEs : null,
			protein: String(row.getValue('protein')),
			kcal: String(row.getValue('kcal')),
			fat: String(row.getValue('fat')),
			carbs: String(row.getValue('carbs'))
		}

		setSelectedRow(foodData)
	}

	const handleDrawerClose = () => setSelectedRow(null)

	return (
		<section>
			<div className='flex items-center space-x-10 pb-4 md:space-x-20'>
				<Input
					placeholder={dictionary.common.filterNames}
					value={filterValue}
					onChange={event => {
						const value = event.target.value
						setFilterValue(value)
						setPagination(current => ({ ...current, pageIndex: 0 }))
					}}
					className='max-w-full'
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' className='ml-auto'>
							{dictionary.common.columns}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						{table
							.getAllColumns()
							.filter(column => column.getCanHide())
							.map(column => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={value => column.toggleVisibility(!!value)}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								)
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className='h-full overflow-y-auto rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow
								key={headerGroup.id}
								className='text-xs tracking-tighter sm:text-sm sm:tracking-normal'
							>
								{headerGroup.headers
									.filter(header => header.column.columnDef.header !== 'ID')
									.map(header => {
										return (
											<TableHead
												key={header.id}
												className='max-w-24 sm:max-w-fit'
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
											</TableHead>
										)
									})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<Drawer key={row.id}>
									<DrawerTrigger asChild>
										<TableRow
											data-state={row.getIsSelected() && 'selected'}
											className='cursor-pointer text-xs tracking-tighter sm:text-sm sm:tracking-normal'
											onClick={() => handleCellClick(row)}
										>
											{row
												.getVisibleCells()
												.filter(cell => cell.column.columnDef.header !== 'ID')
												.map(cell => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												))}
										</TableRow>
									</DrawerTrigger>
									{selectedRow && (
										<FoodDrawer
											foodData={selectedRow}
											handleDrawerClose={handleDrawerClose}
										/>
									)}
								</Drawer>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									{dictionary.common.noResults}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='mt-3 space-y-1'>
				<p className='text-nowrap text-xs font-light text-foreground/80'>
					{dictionary.food.dataSource}{' '}
					<a
						href='https://fdc.nal.usda.gov/'
						target='_blank'
						rel='noopener noreferrer'
						className='text-foreground hover:underline'
					>
						{dictionary.food.usdaFoodData}
					</a>
				</p>
				<p className='col-span-5 text-nowrap text-xs font-light text-foreground/80 lg:hidden'>
					{dictionary.food.nutritionNote}
				</p>
			</div>

			<div className='flex items-center justify-end space-x-2 py-4'>
				<DialogClose asChild className='block lg:hidden'>
					<Button variant='outline' size='sm'>
						{dictionary.common.cancel}
					</Button>
				</DialogClose>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					{dictionary.common.previous}
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{dictionary.common.next}
				</Button>
			</div>
		</section>
	)
}
