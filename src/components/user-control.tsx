'use client';

import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { SparklesIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useSettingsModal } from '@/modules/settings/hooks/use-settings-modal';

interface UserControlProps {
	showName?: boolean;
}

export const UserControl = ({ showName = false }: UserControlProps) => {
	const { resolvedTheme } = useTheme();
	const { onOpen } = useSettingsModal();

	return (
		<UserButton
			showName={showName}
			appearance={{
				captcha: {
					theme: resolvedTheme === 'dark' ? 'dark' : 'light',
				},
				elements: {
					userButtonAvatarBox: 'size-8!',
					userButtonBox: 'rounded-md!',
					userButtonTrigger: 'rounded-md!',
				},
				theme: resolvedTheme === 'dark' ? dark : undefined,
			}}
			userProfileProps={{
				appearance: {
					captcha: {
						theme: resolvedTheme === 'dark' ? 'dark' : 'light',
					},
					theme: resolvedTheme === 'dark' ? dark : undefined,
				},
			}}
		>
			<UserButton.MenuItems>
				<UserButton.Action
					label='AI Settings'
					labelIcon={<SparklesIcon className='size-4' strokeWidth={2.1} />}
					onClick={onOpen}
				/>
			</UserButton.MenuItems>
		</UserButton>
	);
};
