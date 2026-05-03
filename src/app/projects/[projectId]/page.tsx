import { Suspense } from 'react';
import type { Metadata } from 'next';

import { auth } from '@clerk/nextjs/server';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { TRPCError } from '@trpc/server';
import { ErrorBoundary } from 'react-error-boundary';

import { ProjectView, ProjectViewError, ProjectViewLoading } from '@/modules/projects/ui/views/project-view';

import { appRouter } from '@/trpc/routers/_app';
import { getQueryClient, trpc } from '@/trpc/server';

interface ProjectIdPageProps {
	params: Promise<{
		projectId: string;
	}>;
}

export const generateMetadata = async ({ params }: ProjectIdPageProps): Promise<Metadata> => {
	const { projectId } = await params;

	const caller = appRouter.createCaller({ auth: await auth() });

	let projectName = 'Project';

	try {
		const project = await caller.projects.getOne({ id: projectId });
		projectName = project.name;
	} catch (error) {
		if (error instanceof TRPCError) projectName = error.message;
	}

	return {
		description: `View the project ${projectName} and its messages.`,
		title: projectName,
	};
};

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
	const { projectId } = await params;

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(
		trpc.messages.getMany.queryOptions({
			projectId,
		})
	);
	void queryClient.prefetchQuery(
		trpc.projects.getOne.queryOptions({
			id: projectId,
		})
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ErrorBoundary FallbackComponent={ProjectViewError}>
				<Suspense fallback={<ProjectViewLoading />}>
					<ProjectView projectId={projectId} />
				</Suspense>
			</ErrorBoundary>
		</HydrationBoundary>
	);
};

export default ProjectIdPage;
