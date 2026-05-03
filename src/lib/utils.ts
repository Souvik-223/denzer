import type { Message } from '@inngest/agent-kit';
import { clsx, type ClassValue } from 'clsx';
import { APIError, AuthenticationError, OpenAIError, RateLimitError } from 'openai';
import { twMerge } from 'tailwind-merge';

import { env } from '@/env/client';
import type { TreeItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const absoluteUrl = (path: string): string => {
	const formattedPath = path.trim();
	if (formattedPath.startsWith('http')) return formattedPath;

	let baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

	const vercelUrl = env.NEXT_PUBLIC_VERCEL_URL;
	const vercelEnv = env.NEXT_PUBLIC_VERCEL_ENV;

	if (!!vercelEnv && vercelEnv === 'preview' && !!vercelUrl) baseUrl = `https://${vercelUrl}`;

	return `${baseUrl}${formattedPath.startsWith('/') ? '' : '/'}${formattedPath}`;
};

export const getLanguageFromExtension = (filename: string): string => {
	const extension = filename.split('.').pop()?.toLowerCase();

	return extension || 'text';
};

/**
 * Converts a record of files to a tree structure.
 * @param files - The record of file paths to content.
 * @returns The tree structure for TreeView component.
 * @example
 * Input: { 'src/Button.tsx': '...', 'README.md': '...' }
 * Output: [['src', 'Button.tsx'], ['README.md']]
 */
export const convertFilesToTreeItems = (files: { [path: string]: string }): TreeItem[] => {
	interface TreeNode {
		[key: string]: TreeNode | null;
	}

	const tree: TreeNode = {};
	const sortedPaths = Object.keys(files).sort();

	for (const filePath of sortedPaths) {
		const parts = filePath.split('/');
		let current = tree;

		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			if (!current[part]) current[part] = {};

			current = current[part];
		}

		const fileName = parts[parts.length - 1];
		current[fileName] = null;
	}

	function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
		const entries = Object.entries(node);

		if (entries.length === 0) return name || '';

		const children: TreeItem[] = [];

		for (const [key, value] of entries) {
			if (value === null) children.push(key);
			else {
				// This is a folder
				const subTree = convertNode(value, key);

				if (Array.isArray(subTree)) children.push([key, ...subTree]);
				else children.push([key, subTree]);
			}
		}

		return children;
	}

	const result = convertNode(tree);

	return Array.isArray(result) ? result : [result];
};

interface GenerateTextFromMessageProps {
	defaultText: string;
	message: Message;
}

export const generateTextFromMessage = ({ defaultText, message }: GenerateTextFromMessageProps): string => {
	if (message.type !== 'text') return defaultText;

	if (Array.isArray(message.content)) return message.content.join(' ');

	return message.content;
};

export const getAISettingsErrorMessage = (error: unknown): string => {
	if (error instanceof AuthenticationError || (error instanceof APIError && error.status === 401)) {
		return 'Invalid API key. Please check your key and try again';
	}

	if (error instanceof RateLimitError || (error instanceof APIError && error.status === 429)) {
		const code = error instanceof APIError ? error.code : null;
		const message = error instanceof Error ? error.message : '';
		const isQuota =
			code === 'insufficient_quota' || /insufficient_quota|exceeded your current quota|quota|billing/i.test(message);

		if (isQuota) return 'Not enough credits. Please purchase more credits and try again';

		return 'Rate limit reached. Please try again in a moment';
	}

	if (error instanceof OpenAIError) return error.message || 'Failed to verify API key';

	if (error instanceof Error) return error.message;

	return 'Failed to verify API key';
};
