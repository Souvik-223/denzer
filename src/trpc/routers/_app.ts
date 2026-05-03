import { messagesRouter } from '@/modules/messages/server/procedures';
import { projectsRouter } from '@/modules/projects/server/procedures';
import { settingsRouter } from '@/modules/settings/server/procedures';
import { usageRouter } from '@/modules/usage/server/procedures';

import { createTRPCRouter } from '@/trpc/init';

export const appRouter = createTRPCRouter({
	messages: messagesRouter,
	projects: projectsRouter,
	settings: settingsRouter,
	usage: usageRouter,
});

export type AppRouter = typeof appRouter;
