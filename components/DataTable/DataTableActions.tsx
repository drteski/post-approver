'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CarbonEdit, CarbonSearch, CarbonTrashCan } from '@/components/Icones';
import { useState } from 'react';
import { DeleteDialog } from '@/components/DeleteDialog';
import axios from 'axios';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


export const DataTableActions = ({ id }: { id: number }) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);


	return (<div className="flex gap-2 justify-center items-center">
		<Tooltip>
			<TooltipTrigger asChild>
				<Button size="icon" variant="secondary" className="size-16 md:size-9" asChild>
					<Link href={`/${id}/preview`}><CarbonSearch /></Link>
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Podgląd</p>
			</TooltipContent>
		</Tooltip>
		<Tooltip>
			<TooltipTrigger asChild>
				<Button size="icon"
					variant="secondary" className="size-16 md:size-9" asChild><Link
					href={`/${id}`}><CarbonEdit /></Link></Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Edytuj</p>
			</TooltipContent>
		</Tooltip>
		<Tooltip>
			<TooltipTrigger asChild>
				<Button size="icon" variant="destructive" className="size-16 md:size-9 cursor-pointer"
					onClick={() => setShowDeleteDialog(true)}><CarbonTrashCan /></Button>

			</TooltipTrigger>
			<TooltipContent>
				<p>Usuń</p>
			</TooltipContent>
		</Tooltip>
		<DeleteDialog open={showDeleteDialog} onDialogClose={() => setShowDeleteDialog(false)}
			onConfirm={async () => {
				await axios.delete(`/api/posts/${id}`, { headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET}` } }).then(() => {
					setShowDeleteDialog(false);
					window.location.reload();
				});
			}} />
	</div>);
};



