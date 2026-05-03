'use client';

import { useCallback, useRef, useState, type JSX } from 'react';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button, type ButtonProps } from '@/components/ui/button';

interface UseConfirmProps {
	title: string;
	message: string;
	variant?: ButtonProps['variant'];
}

export const useConfirm = ({
	title,
	message,
	variant = 'destructive',
}: UseConfirmProps): [() => JSX.Element, () => Promise<unknown>] => {
	const [isOpen, setIsOpen] = useState(false);
	const resolverRef = useRef<((value: boolean) => void) | undefined>(undefined);

	const confirm = useCallback(() => {
		setIsOpen(true);
		return new Promise<boolean>((resolve) => {
			resolverRef.current = resolve;
		});
	}, []);

	const handleClose = useCallback(() => {
		setIsOpen(false);
		resolverRef.current?.(false);
		resolverRef.current = undefined;
	}, []);

	const handleOpenChange = useCallback((open: boolean) => {
		if (!open) {
			setIsOpen(false);
			resolverRef.current?.(false);
			resolverRef.current = undefined;
		}
	}, []);

	const handleConfirm = useCallback(() => {
		setIsOpen(false);
		resolverRef.current?.(true);
		resolverRef.current = undefined;
	}, []);

	const ConfirmationDialog = useCallback(
		() => (
			<ResponsiveDialog title={title} description={message} open={isOpen} onOpenChange={handleOpenChange}>
				<div className='flex w-full flex-col-reverse items-center justify-end gap-2 pt-4 lg:flex-row'>
					<Button onClick={handleClose} variant='outline' className='w-full lg:w-auto'>
						Cancel
					</Button>

					<Button onClick={handleConfirm} variant={variant} className='w-full lg:w-auto'>
						Confirm
					</Button>
				</div>
			</ResponsiveDialog>
		),
		[title, message, variant, isOpen, handleOpenChange, handleClose, handleConfirm]
	);

	return [ConfirmationDialog, confirm];
};
