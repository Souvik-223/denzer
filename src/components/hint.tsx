'use client';

import type { PropsWithChildren } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HintProps {
	text: string;
	align?: React.ComponentProps<typeof TooltipContent>['align'];
	side?: React.ComponentProps<typeof TooltipContent>['side'];
}

export const Hint = ({ text, align = 'center', children, side = 'top' }: Readonly<PropsWithChildren<HintProps>>) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger aria-label={text} asChild>
					{children}
				</TooltipTrigger>

				<TooltipContent side={side} align={align}>
					<p>{text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
