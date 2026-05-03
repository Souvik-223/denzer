import { useEffect, useRef } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { MessageRole, type Fragment } from '@/generated/prisma/browser';
import { useTRPC } from '@/trpc/client';

import { MessageCard } from './message-card';
import { MessageForm } from './message-form';
import { MessageLoading } from './message-loading';

interface MessagesContainerProps {
	activeFragment: Fragment | null;
	projectId: string;
	setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessagesContainer = ({ activeFragment, projectId, setActiveFragment }: MessagesContainerProps) => {
	const trpc = useTRPC();
	const bottomRef = useRef<HTMLDivElement>(null);
	const lastAssistantMessageIdRef = useRef<string | null>(null);

	const { data: messages } = useSuspenseQuery(
		trpc.messages.getMany.queryOptions(
			{ projectId },
			{
				refetchInterval: 5000,
			}
		)
	);

	const lastMessage = messages[messages.length - 1];
	const isLastMessageUser = lastMessage?.role === MessageRole.USER;

	useEffect(() => {
		const lastAssistantMessage = messages.findLast(
			(message) => message.role === MessageRole.ASSISTANT && !!message.fragment
		);

		if (!!lastAssistantMessage?.fragment && lastAssistantMessage.id !== lastAssistantMessageIdRef.current) {
			setActiveFragment(lastAssistantMessage.fragment);
			lastAssistantMessageIdRef.current = lastAssistantMessage?.id;
		}
	}, [messages, setActiveFragment]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView();
	}, [messages.length]);

	return (
		<div className='flex min-h-0 flex-1 flex-col'>
			<div className='custom-scrollbar min-h-0 flex-1 overflow-y-auto'>
				<div className='pt-2 pr-1'>
					{messages.map((message) => (
						<MessageCard
							key={message.id}
							content={message.content}
							role={message.role}
							type={message.type}
							fragment={message.fragment}
							createdAt={message.createdAt}
							isActiveFragment={activeFragment?.id === message.fragment?.id}
							onFragmentClick={() => setActiveFragment(message.fragment)}
						/>
					))}

					{isLastMessageUser && <MessageLoading />}
					<div ref={bottomRef} />
				</div>
			</div>

			<div className='relative p-3 pt-1'>
				<div className='to-background/90 pointer-events-none absolute inset-x-0 -top-6 h-6 bg-linear-to-b from-transparent' />
				<MessageForm projectId={projectId} />
			</div>
		</div>
	);
};
