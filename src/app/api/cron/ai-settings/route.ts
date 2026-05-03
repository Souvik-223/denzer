import { NextResponse, type NextRequest } from 'next/server';

import { subDays } from 'date-fns';

import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from '@/config/http-status-codes';
import { env } from '@/env/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
	try {
		const authHeader = req.headers.get('authorization');
		if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{
					status: UNAUTHORIZED,
				}
			);
		}

		const now = new Date();
		const thirtyDaysAgo = subDays(now, 30);

		await db.userSettings.deleteMany({
			where: {
				updatedAt: {
					lte: thirtyDaysAgo,
				},
			},
		});

		return NextResponse.json({ status: OK });
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to delete AI Settings' },
			{
				status: INTERNAL_SERVER_ERROR,
			}
		);
	}
}
