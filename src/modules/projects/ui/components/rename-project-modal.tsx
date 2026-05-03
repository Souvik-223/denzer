'use client';

import { useRenameProjectModal } from '@/modules/projects/hooks/use-rename-project-modal';

import { ResponsiveDialog } from '@/components/responsive-dialog';

import { RenameProjectForm } from './rename-project-form';

export const RenameProjectModal = () => {
	const { isOpen, onClose, projectId, projectName } = useRenameProjectModal();

	if (!projectId || !projectName) return null;

	return (
		<ResponsiveDialog
			open={isOpen}
			onOpenChange={onClose}
			title='Rename Project'
			description='Update your project name to better reflect its purpose.'
		>
			<RenameProjectForm projectId={projectId} initialName={projectName} onSuccess={onClose} />
		</ResponsiveDialog>
	);
};
