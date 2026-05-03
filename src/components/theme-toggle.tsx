'use client';

import { startTransition, useEffect, useState } from 'react';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

const THEME_ORDER = ['light', 'dark', 'system'] as const;
type ThemeValue = (typeof THEME_ORDER)[number];

export const ThemeToggle = () => {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		startTransition(() => {
			setMounted(true);
		});
	}, []);

	if (!mounted) {
		return (
			<Button size='sm' variant='outline' className='size-9 rounded-full p-0' disabled>
				<div className='size-4' />
			</Button>
		);
	}

	const currentTheme = (theme ?? 'system') as ThemeValue;
	const effectiveDark = (resolvedTheme ?? 'light') === 'dark';

	const handleToggle = () => {
		const nextIndex = (THEME_ORDER.indexOf(currentTheme) + 1) % THEME_ORDER.length;
		setTheme(THEME_ORDER[nextIndex]);
	};

	const titles: Record<ThemeValue, string> = {
		dark: 'Dark mode (next: system)',
		light: 'Light mode (next: dark)',
		system: `System theme (next: light)${effectiveDark ? ' · currently dark' : ' · currently light'}`,
	};

	const Icon = currentTheme === 'light' ? SunIcon : currentTheme === 'dark' ? MoonIcon : MonitorIcon;

	return (
		<Button size='icon' variant='outline' className='rounded-full' onClick={handleToggle} title={titles[currentTheme]}>
			<Icon className='size-4 stroke-2' />
		</Button>
	);
};
