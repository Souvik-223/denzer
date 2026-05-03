'use client';

import { useSettingsModal } from '@/modules/settings/hooks/use-settings-modal';

import { ResponsiveDialog } from '@/components/responsive-dialog';

import { AISettingsForm } from './ai-settings-form';

export const SettingsModal = () => {
	const { isOpen, onClose } = useSettingsModal();

	return (
		<ResponsiveDialog
			open={isOpen}
			onOpenChange={onClose}
			title='AI Settings'
			description='Unlock the full potential of your Vibe AI assistant with personalized settings and preferences.'
		>
			<AISettingsForm />
		</ResponsiveDialog>
	);
};
