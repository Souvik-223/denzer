'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';

const RenameProjectSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
});

interface RenameProjectFormProps {
	projectId: string;
	initialName: string;
	onSuccess: () => void;
}

export const RenameProjectForm = ({ projectId, initialName, onSuccess }: RenameProjectFormProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof RenameProjectSchema>>({
		defaultValues: {
			name: initialName,
		},
		resolver: zodResolver(RenameProjectSchema),
	});

	const updateProject = useMutation(
		trpc.projects.update.mutationOptions({
			onError: (error) => {
				toast.error(error.message || 'Failed to rename project');
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
				await queryClient.invalidateQueries(trpc.projects.getOne.queryOptions({ id: projectId }));

				toast.success('Project renamed successfully');
				onSuccess();
			},
		})
	);

	const handleSubmit = (values: z.infer<typeof RenameProjectSchema>) => {
		updateProject.mutate({
			id: projectId,
			name: values.name,
		});
	};

	const isPending = updateProject.isPending;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6' autoComplete='off'>
				<FormField
					disabled={isPending}
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Project Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter project name' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-end gap-2'>
					<Button type='button' variant='outline' onClick={onSuccess} disabled={isPending}>
						Cancel
					</Button>

					<Button type='submit' disabled={isPending} isLoading={isPending}>
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
};
