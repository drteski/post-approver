'use client';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function DeleteDialog({ open, onConfirm, onDialogClose }: {
	open: boolean,
	onDialogClose: () => void,
	onConfirm: () => void
}) {
	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Czy jesteś pewny, że chcesz to usunąć?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Tej operacji nie da się cofnąć.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onDialogClose}>Anuluj</AlertDialogCancel>
					<Button onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-700">Usuń</Button>

				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}