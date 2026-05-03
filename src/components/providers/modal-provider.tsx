'use client';

import { useEffect, useState } from 'react';

import { RenameProjectModal } from '@/modules/projects/ui/components/rename-project-modal';
import { SettingsModal } from '@/modules/settings/ui/components/settings-modal';

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<SettingsModal />
			<RenameProjectModal />
		</>
	);
};
