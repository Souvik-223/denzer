import { auth } from '@clerk/nextjs/server';
import { RateLimiterPrisma } from 'rate-limiter-flexible';

import { DURATION, FREE_POINTS, GENERATION_COST, PRO_POINTS } from '@/modules/usage/config';

import { db } from '@/lib/db';

export const getUsageTracker = async () => {
	const { has } = await auth();
	const hasProAccess = has({ plan: 'pro' });

	const usageTracker = new RateLimiterPrisma({
		duration: DURATION,
		points: hasProAccess ? PRO_POINTS : FREE_POINTS,
		storeClient: db,
		tableName: 'Usage',
	});

	return usageTracker;
};

export const consumeCredits = async () => {
	const { userId } = await auth();

	if (!userId) throw new Error('Unauthorized');

	const usageTracker = await getUsageTracker();
	const result = await usageTracker.consume(userId, GENERATION_COST);

	return result;
};

export const getUsageStatus = async () => {
	const { userId } = await auth();

	if (!userId) throw new Error('Unauthorized');

	const usageTracker = await getUsageTracker();
	const result = await usageTracker.get(userId);

	return result;
};
