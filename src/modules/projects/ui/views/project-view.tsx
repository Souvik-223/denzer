'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@clerk/nextjs';
import { CodeIcon, CrownIcon, EyeIcon } from 'lucide-react';

import { FragmentWeb } from '@/modules/projects/ui/components/fragment-web';
import { MessagesContainer } from '@/modules/projects/ui/components/messages-container';
import { ProjectHeader } from '@/modules/projects/ui/components/project-header';

import { ErrorState } from '@/components/error-state';
import { FileExplorer } from '@/components/file-explorer';
import { LoadingState } from '@/components/loading-state';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserControl } from '@/components/user-control';
import { SANDBOX_TIMEOUT } from '@/constants';
import type { Fragment } from '@/generated/prisma/browser';
import type { ErrorFallbackProps } from '@/types';

interface ProjectViewProps {
	projectId: string;
}

export const ProjectView = ({ projectId }: ProjectViewProps) => {
	const { has } = useAuth();
	const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
	const [tabState, setTabState] = useState<'preview' | 'code'>('preview');
	const [nowTs, setNowTs] = useState(() => Date.now());

	const hasProAccess = has?.({ plan: 'pro' }) || false;

	useEffect(() => {
		if (!activeFragment) return;
		const id = window.setInterval(() => setNowTs(Date.now()), 1000);
		return () => window.clearInterval(id);
	}, [activeFragment]);

	const createdAtTs = useMemo(() => {
		if (!activeFragment) return 0;
		const ts = new Date(activeFragment.createdAt).getTime();
		return Number.isFinite(ts) ? ts : 0;
	}, [activeFragment]);

	const remainingMs = useMemo(() => {
		if (!activeFragment) return 0;
		return Math.max(0, SANDBOX_TIMEOUT - (nowTs - createdAtTs));
	}, [createdAtTs, nowTs, activeFragment]);

	const timeBadge = useMemo(() => {
		if (!activeFragment) return null;
		if (remainingMs <= 0) {
			return { className: 'border-red-500/30 bg-red-500/10 text-red-600', label: 'Expired' };
		}

		const totalSeconds = Math.ceil(remainingMs / 1000);
		const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
		const ss = String(totalSeconds % 60).padStart(2, '0');

		// Green → Orange → Red as time runs out
		const className =
			remainingMs > 10 * 60 * 1000
				? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
				: remainingMs > 2 * 60 * 1000
					? 'border-orange-500/30 bg-orange-500/10 text-orange-700'
					: 'border-red-500/30 bg-red-500/10 text-red-600';

		return { className, label: `${mm}:${ss}` };
	}, [activeFragment, remainingMs]);

	return (
		<div className='h-screen'>
			<ResizablePanelGroup orientation='horizontal'>
				<ResizablePanel defaultSize={35} minSize={20} className='flex min-h-0 flex-col'>
					<ProjectHeader projectId={projectId} />

					<MessagesContainer
						projectId={projectId}
						activeFragment={activeFragment}
						setActiveFragment={setActiveFragment}
					/>
				</ResizablePanel>

				<ResizableHandle className='hover:bg-primary z-50 transition-colors' />

				<ResizablePanel defaultSize={65} minSize={50}>
					{!!activeFragment && (
						<Tabs
							className='h-full gap-y-0'
							defaultValue='preview'
							value={tabState}
							onValueChange={(value) => setTabState(value as 'preview' | 'code')}
						>
							<div className='flex w-full items-center gap-x-2 border-b p-2'>
								<TabsList className='h-8 rounded-md border p-0'>
									<TabsTrigger value='preview' className='rounded-md'>
										<EyeIcon />
										<span>Demo</span>
									</TabsTrigger>

									<TabsTrigger value='code' className='rounded-md'>
										<CodeIcon />
										<span>Code</span>
									</TabsTrigger>
								</TabsList>

								<div className='ml-auto flex items-center gap-x-2'>
									{tabState === 'preview' && !!timeBadge && (
										<span
											className={
												'inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-semibold tabular-nums' +
												` ${timeBadge.className}`
											}
											title='Sandbox time remaining'
										>
											{timeBadge.label}
										</span>
									)}

									{!hasProAccess && (
										<Button size='sm' variant='tertiary' asChild>
											<Link href='/pricing'>
												<CrownIcon /> Upgrade
											</Link>
										</Button>
									)}

									<UserControl />
									<ThemeToggle />
								</div>
							</div>

							<TabsContent value='preview'>
								<FragmentWeb data={activeFragment} />
							</TabsContent>

							<TabsContent value='code' className='min-h-0'>
								{!!activeFragment?.files && <FileExplorer files={activeFragment.files as { [path: string]: string }} />}
							</TabsContent>
						</Tabs>
					)}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};

export const ProjectViewLoading = () => {
	return (
		<div className='flex h-screen flex-1 items-center justify-center'>
			<LoadingState title='Loading project' description='This may take a few seconds.' />
		</div>
	);
};

export const ProjectViewError = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
	return (
		<div className='flex h-screen flex-1 items-center justify-center'>
			<ErrorState
				title='Failed to load project'
				description={error?.message || 'Something went wrong.'}
				onRetry={resetErrorBoundary}
			/>
		</div>
	);
};
