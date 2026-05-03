import { z } from 'zod';

import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from '@/modules/messages/config';

export const CreateProjectSchema = z.object({
	value: z.string().trim().min(MIN_MESSAGE_LENGTH, 'Value is required').max(MAX_MESSAGE_LENGTH, 'Value is too long'),
});
