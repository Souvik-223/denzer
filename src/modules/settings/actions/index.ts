'use server';

import { OpenAI } from 'openai';

import { getAISettingsErrorMessage } from '@/lib/utils';

export const verifyAISettings = async (apiKey: string) => {
	try {
		const openai = new OpenAI({
			apiKey,
		});

		// Verify API key and that account has credits by sending a minimal chat request
		const completion = await openai.chat.completions.create({
			max_completion_tokens: 5, // eslint-disable-line camelcase -- OpenAI API parameter
			messages: [{ content: 'hi', role: 'user' }],
			model: 'gpt-4o-mini',
		});

		if (!completion.choices[0]?.message?.content) throw new Error('No response from API');

		return { error: null, success: true };
	} catch (error) {
		return { error: getAISettingsErrorMessage(error), success: false };
	}
};
