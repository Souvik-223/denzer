'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeftIcon, EllipsisVerticalIcon, Loader2Icon, PencilIcon, Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';

import { useRenameProjectModal } from '@/modules/projects/hooks/use-rename-project-modal';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirm } from '@/hooks/use-confirm';
import { useTRPC } from '@/trpc/client';

interface ProjectHeaderProps {
	projectId: string;
}

export const ProjectHeader = ({ projectId }: ProjectHeaderProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({ id: projectId }));
	const { onOpen: openRenameModal } = useRenameProjectModal();
	const [ConfirmDialog, confirm] = useConfirm({
		message: 'Are you sure you want to delete this project? This action cannot be undone.',
		title: 'Delete Project',
	});

	const deleteProject = useMutation(
		trpc.projects.remove.mutationOptions({
			onError: (error) => {
				toast.error(error.message || 'Failed to delete project');
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
				toast.success('Project deleted successfully');
				router.push('/');
			},
		})
	);

	const handleRename = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		openRenameModal(project.id, project.name);
	};

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const ok = await confirm();
		if (!ok) return;

		deleteProject.mutate({ id: project.id });
	};

	const isDeleting = deleteProject.isPending;

	return (
		<header className='bg-sidebar/50 group flex items-center justify-between border-b px-3 py-2.5 transition-colors'>
			<div className='flex items-center gap-1'>
				<Button variant='ghost' size='icon-sm' className='shrink-0 p-0' asChild>
					<Link href='/' className='flex items-center justify-center'>
						<ChevronLeftIcon className='size-5' strokeWidth={2.5} />
						<span className='sr-only'>Back to Dashboard</span>
					</Link>
				</Button>

				<div className='flex items-center gap-2.5'>
					<div className='bg-background flex size-8 shrink-0 items-center justify-center rounded-md border'>
						<img src='/logo.svg' alt='Vibe logo' width={16} height={16} className='shrink-0' />
					</div>
					<div className='flex min-w-0 flex-col'>
						<span className='truncate text-sm leading-tight font-semibold'>{project.name}</span>
						<span className='text-muted-foreground text-xs leading-tight'>
							{formatDistanceToNow(project.createdAt, { addSuffix: true })}
						</span>
					</div>
				</div>
			</div>

			<ConfirmDialog />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						disabled={isDeleting}
						variant='ghost'
						size='icon'
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						aria-label='More options'
					>
						{isDeleting ? <Loader2Icon className='size-4 animate-spin' /> : <EllipsisVerticalIcon className='size-4' />}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem onClick={handleRename} disabled={isDeleting}>
						<PencilIcon className='size-4' />
						Rename
					</DropdownMenuItem>

					<DropdownMenuItem variant='destructive' onClick={handleDelete} disabled={isDeleting}>
						<Trash2Icon className='size-4' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
};
