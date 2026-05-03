import { Sandbox } from '@e2b/code-interpreter';
import type { AgentResult, TextMessage } from '@inngest/agent-kit';

import { SANDBOX_TIMEOUT } from '@/constants';

export async function getSandbox(sandboxId: string) {
	const sandbox = await Sandbox.connect(sandboxId);

	await sandbox.setTimeout(SANDBOX_TIMEOUT);
	return sandbox;
}

export function getLastAssistantTextMessageContent(result: AgentResult) {
	const lastAssistantTextMessageIndex = result.output.findLastIndex((message) => message.role === 'assistant');

	const message = result.output[lastAssistantTextMessageIndex] as TextMessage | undefined;

	return message?.content
		? typeof message.content === 'string'
			? message.content
			: message.content.map((c) => c.text).join('')
		: undefined;
}
