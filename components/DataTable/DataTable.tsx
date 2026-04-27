'use client';

import React from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { DataTableActions } from '@/components/DataTable/DataTableActions';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CarbonCheckmark, CarbonCloseLarge, CarbonSubtractLarge } from '@/components/Icones';

export type Person = {
	img: string;
	id: number;
	title: string;
	alias: string;
	approved: boolean | null;
	createdAt: string;
	updatedAt: string;
};

const columnHelper = createColumnHelper<Person>();

const columns = [
	columnHelper.accessor('id', { header: 'ID' }),
	columnHelper.accessor('img', { header: 'Zdjęcie' }),
	columnHelper.accessor('title', { header: 'Tytuł' }),
	columnHelper.accessor('alias', { header: 'Sklep' }),
	columnHelper.accessor('approved', { header: 'Status' }),
	columnHelper.accessor('createdAt', { header: 'Utworzono' }),
	columnHelper.accessor('updatedAt', { header: 'Zaktualizowano' })
];

export const DataTable = ({ data }: { data: Person[] }) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 10, pageIndex: 0 } }
	});

	return (
		<div className="flex flex-col h-full bg-neutral-50 lg:bg-transparent">
			<div className="flex-1 overflow-y-auto md:hidden p-4 space-y-6">
				{table.getRowModel().rows.map((row) => (
					<div
						key={row.id}
						className="bg-white rounded-2xl border border-neutral-200 shadow-md overflow-hidden flex flex-col"
					>
						<div className="relative w-full aspect-video border-b border-neutral-100">
							<Image
								alt=""
								src={row.original.img}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</div>
						<div className="p-5 flex flex-col gap-4">
							<div className="flex flex-col gap-1">
								<span
									className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tytuł</span>
								<h3 className="font-bold text-lg text-neutral-900 leading-snug break-words">
									{row.original.title}
								</h3>
							</div>
							<div className="grid grid-cols-2 grid-rows-2 gap-4 pt-2 border-t border-neutral-50">
								<div className="flex flex-col">
									<span className="text-[10px] font-bold text-neutral-400 uppercase">Sklep</span>
									<span className="text-sm font-medium text-neutral-700">{row.original.alias}</span>
								</div>
								<div className="flex flex-col items-end">
									<span className="text-[10px] font-bold text-neutral-400 uppercase">Status</span>
									<div className="mt-1">
										{row.original.approved === null ?
											<CarbonSubtractLarge className="w-6 h-6 text-neutral-300" /> :
											row.original.approved ?
												<CarbonCheckmark className="w-6 h-6 text-green-500" /> :
												<CarbonCloseLarge className="w-6 h-6 text-red-500" />}
									</div>
								</div>
								<div className="flex flex-col">
									<span className="text-[10px] font-bold text-neutral-400 uppercase">Utworzono</span>
									<span
										className="text-xs text-neutral-600">{format(new Date(row.original.createdAt), 'dd-MM-yyyy HH:mm')}</span>
								</div>
								<div className="flex flex-col text-right">
									<span
										className="text-[10px] font-bold text-neutral-400 uppercase">Aktualizacja</span>
									<span
										className="text-xs text-neutral-600">{format(new Date(row.original.updatedAt), 'dd-MM-yyyy HH:mm')}</span>
								</div>
							</div>
						</div>
						<div className="bg-neutral-50/80 p-3 px-5 border-t border-neutral-100 flex justify-end gap-3">
							<DataTableActions id={row.original.id} />
						</div>
					</div>
				))}
				<div className="h-20" />
			</div>
			<div className="hidden md:block flex-1 overflow-y-auto min-h-0 border rounded-xl border-neutral-200">
				<Table>
					<TableHeader className="sticky top-0 bg-neutral-100 z-10 shadow-sm">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								<TableHead className="w-16 text-center">ID</TableHead>
								<TableHead className="w-48">Zdjęcie</TableHead>
								<TableHead>Tytuł</TableHead>
								<TableHead className="w-32 text-center">Sklep</TableHead>
								<TableHead className="w-32 text-center">Status</TableHead>
								<TableHead className="w-44 text-center">Utworzono</TableHead>
								<TableHead className="w-44 text-center">Zaktualizowano</TableHead>
								<TableHead className="w-20 text-center">Akcje</TableHead>
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								<TableCell className="text-center text-neutral-500">{row.original.id}</TableCell>
								<TableCell className="p-0">
									<div className="relative w-full aspect-[2.5/1]">
										<Image alt="" src={row.original.img} fill className="object-cover" />
									</div>
								</TableCell>
								<TableCell className="font-medium max-w-md truncate">{row.original.title}</TableCell>
								<TableCell className="text-center">{row.original.alias}</TableCell>
								<TableCell>
									<div className="flex justify-center">
										{row.original.approved === null ?
											<CarbonSubtractLarge className="w-6 h-6 text-neutral-300" /> :
											row.original.approved ?
												<CarbonCheckmark className="w-6 h-6 text-green-500" /> :
												<CarbonCloseLarge className="w-6 h-6 text-red-500" />}
									</div>
								</TableCell>
								<TableCell className="text-center text-xs text-neutral-500">
									{format(new Date(row.original.createdAt), 'dd-MM-yyyy HH:mm')}
								</TableCell>
								<TableCell className="text-center text-xs text-neutral-500">
									{format(new Date(row.original.updatedAt), 'dd-MM-yyyy HH:mm')}
								</TableCell>
								<TableCell className="text-center">
									<DataTableActions id={row.original.id} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<footer
				className="shrink-0 bg-white p-4 flex justify-between items-center gap-4 z-30">
				<div className="hidden sm:block text-sm text-neutral-500">
					Łącznie: <span className="font-bold">{data.length}</span> postów
				</div>
				<div className="flex items-center gap-2 mx-auto sm:mx-0">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Poprzednia
					</Button>
					<span className="text-sm font-medium px-4">
                        Strona {table.getState().pagination.pageIndex + 1}
                    </span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Następna
					</Button>
				</div>
			</footer>
		</div>
	);
};