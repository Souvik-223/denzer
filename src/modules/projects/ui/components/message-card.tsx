import { formatDate } from 'date-fns';
import { ChevronRightIcon, Code2Icon } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { MessageRole, MessageType, type Fragment } from '@/generated/prisma/browser';
import { cn } from '@/lib/utils';

interface FragmentCardProps {
	fragment: Fragment;
	isActiveFragment: boolean;
	onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({ fragment, isActiveFragment, onFragmentClick }: FragmentCardProps) => {
	return (
		<button
			className={cn(
				'bg-muted hover:bg-secondary flex w-fit items-start gap-2 rounded-lg border p-3 text-start transition-colors',
				isActiveFragment && 'bg-primary text-primary-foreground border-primary hover:bg-primary'
			)}
			onClick={() => onFragmentClick(fragment)}
		>
			<Code2Icon className='mt-0.5 size-4' />

			<div className='flex flex-1 flex-col'>
				<span className='line-clamp-1 text-sm font-medium'>{fragment.title}</span>

				<span className='text-sm'>Preview</span>
			</div>

			<div className='mt-0.5 flex items-center justify-center'>
				<ChevronRightIcon className='size-4' />
			</div>
		</button>
	);
};

interface AssistantMessageProps extends Omit<FragmentCardProps, 'fragment'> {
	content: string;
	createdAt: Date;
	fragment: Fragment | null;
	type: MessageType;
}

const AssistantMessage = ({
	content,
	createdAt,
	fragment,
	isActiveFragment,
	onFragmentClick,
	type,
}: AssistantMessageProps) => {
	return (
		<div
			className={cn('group flex flex-col px-2 pb-4', type === MessageType.ERROR && 'text-red-700 dark:text-red-500')}
		>
			<div className='mb-2 flex items-center gap-2 pl-2'>
				<img src='/logo.svg' alt='Vibe logo' width={18} height={18} className='shrink-0' />

				<span className='text-sm font-medium'>Vibe</span>
				<span className='text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100'>
					{formatDate(createdAt, "HH:mm 'on' MMM dd, yyyy")}
				</span>
			</div>

			<div className='flex flex-col gap-y-4 pl-8.5'>
				<span>{content}</span>

				{!!fragment && type === MessageType.RESULT && (
					<FragmentCard fragment={fragment} isActiveFragment={isActiveFragment} onFragmentClick={onFragmentClick} />
				)}
			</div>
		</div>
	);
};

interface UserMessageProps {
	content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
	return (
		<div className='flex justify-end pr-2 pb-4 pl-10'>
			<Card className='bg-muted max-w-[80%] rounded-lg border-none p-3 wrap-break-word shadow-none'>{content}</Card>
		</div>
	);
};

interface MessageCardProps extends AssistantMessageProps {
	role: MessageRole;
}

export const MessageCard = ({
	content,
	createdAt,
	fragment,
	isActiveFragment,
	onFragmentClick,
	role,
	type,
}: MessageCardProps) => {
	if (role === MessageRole.ASSISTANT) {
		return (
			<AssistantMessage
				content={content}
				fragment={fragment}
				createdAt={createdAt}
				isActiveFragment={isActiveFragment}
				onFragmentClick={onFragmentClick}
				type={type}
			/>
		);
	}

	return <UserMessage content={content} />;
};
