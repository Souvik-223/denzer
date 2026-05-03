import { TRPCError } from '@trpc/server';

import { verifyAISettings } from '@/modules/settings/actions';
import { AISettingsSchema } from '@/modules/settings/schemas/ai-settings-schema';

import { db } from '@/lib/db';
import { decrypt, encrypt } from '@/lib/encryption';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const settingsRouter = createTRPCRouter({
	getAISettings: protectedProcedure.query(async ({ ctx }) => {
		const { userId } = ctx.auth;

		const settings = await db.userSettings.findUnique({
			where: {
				userId,
			},
		});

		if (!settings) return { apiKey: '' };

		return {
			apiKey: decrypt(settings.apiKey),
		};
	}),
	removeAISettings: protectedProcedure.mutation(async ({ ctx }) => {
		const { userId } = ctx.auth;

		const settings = await db.userSettings.delete({
			where: {
				userId,
			},
		});

		if (!settings) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove AI Settings' });

		return settings;
	}),
	saveAISettings: protectedProcedure.input(AISettingsSchema).mutation(async ({ ctx, input }) => {
		const { userId } = ctx.auth;
		const { apiKey } = input;

		const { error, success } = await verifyAISettings(apiKey);

		if (!success) throw new TRPCError({ code: 'BAD_REQUEST', message: error || 'Failed to verify API key' });

		const encryptedApiKey = encrypt(apiKey);

		const settings = await db.userSettings.upsert({
			create: {
				apiKey: encryptedApiKey,
				userId,
			},
			update: {
				apiKey: encryptedApiKey,
			},
			where: {
				userId,
			},
		});

		if (!settings) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save AI Settings' });

		return settings;
	}),
});
