import { useEffect, useMemo, useState } from 'react';

import { ClipboardCheckIcon, ExternalLinkIcon, HourglassIcon, RefreshCcwIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import { SANDBOX_TIMEOUT } from '@/constants';
import type { Fragment } from '@/generated/prisma/browser';
import { cn } from '@/lib/utils';

interface FragmentWebProps {
	data: Fragment;
}

export const FragmentWeb = ({ data }: FragmentWebProps) => {
	const [copied, setCopied] = useState(false);
	const [fragmentKey, setFragmentKey] = useState(0);
	const [nowTs, setNowTs] = useState(() => Date.now());

	useEffect(() => {
		const id = window.setInterval(() => setNowTs(Date.now()), 1000);
		return () => window.clearInterval(id);
	}, []);

	const createdAtTs = useMemo(() => {
		const ts = new Date(data.createdAt).getTime();
		return Number.isFinite(ts) ? ts : 0;
	}, [data.createdAt]);

	const remainingMs = useMemo(() => {
		return Math.max(0, SANDBOX_TIMEOUT - (nowTs - createdAtTs));
	}, [createdAtTs, nowTs]);

	const isExpired = remainingMs <= 0;

	const [isFrameLoading, setIsFrameLoading] = useState(!isExpired);

	const handleRefresh = () => {
		setIsFrameLoading(true);
		setFragmentKey((prev) => prev + 1);
	};

	const handleCopy = () => {
		try {
			navigator.clipboard.writeText(data.sandboxUrl);
			setCopied(true);

			setTimeout(() => setCopied(false), 2000); // 2 seconds
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to copy to clipboard');
		}
	};

	return (
		<div className='flex size-full flex-col'>
			<div className='bg-sidebar flex items-center gap-x-2 border-b p-2'>
				<Hint text='Refresh' side='right' align='start'>
					<Button
						size='sm'
						variant='outline'
						disabled={!data.sandboxUrl || isFrameLoading || isExpired}
						onClick={handleRefresh}
					>
						<RefreshCcwIcon className={cn(isFrameLoading && 'animate-spin')} />
					</Button>
				</Hint>

				<Hint text='Click to copy' side='bottom'>
					<Button
						size='sm'
						variant='outline'
						disabled={!data.sandboxUrl || copied || isFrameLoading || isExpired}
						onClick={handleCopy}
						className={cn('flex-1 justify-start text-start font-normal', !!data.sandboxUrl && 'disabled:opacity-100')}
					>
						{copied ? (
							<span className='flex items-center gap-x-1 text-emerald-500'>
								<ClipboardCheckIcon className='size-4' />
								<span>Copied to clipboard</span>
							</span>
						) : (
							<span className='truncate'>{data.sandboxUrl}</span>
						)}
					</Button>
				</Hint>

				<Hint text='Open in a new tab' side='left' align='start'>
					<Button
						size='sm'
						variant='outline'
						disabled={!data.sandboxUrl || isFrameLoading || isExpired}
						onClick={() => {
							if (!data.sandboxUrl) return;
							window.open(data.sandboxUrl, '_blank', 'noopener,noreferrer');
						}}
					>
						<ExternalLinkIcon />
					</Button>
				</Hint>
			</div>

			{isExpired ? (
				<div className='from-background to-muted/30 flex size-full items-center justify-center bg-linear-to-b p-6'>
					<div className='bg-card w-full max-w-xl rounded-xl border p-6 shadow-sm'>
						<div className='flex items-start gap-4'>
							<div className='bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-lg border'>
								<HourglassIcon className='text-muted-foreground size-6 stroke-3' />
							</div>

							<div className='min-w-0'>
								<div className='text-lg font-semibold'>Sandbox expired</div>
								<p className='text-muted-foreground mt-1 text-sm'>
									This preview link is only available for {SANDBOX_TIMEOUT / 1000 / 60} minutes.
								</p>
								<p className='text-muted-foreground mt-3 text-xs'>
									Created:{' '}
									<span className='text-foreground/80 font-medium'>{new Date(data.createdAt).toLocaleString()}</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			) : (
				<iframe
					key={fragmentKey}
					className='size-full'
					sandbox='allow-forms allow-scripts allow-same-origin'
					loading='lazy'
					src={data.sandboxUrl}
					title={data.title}
					onLoad={() => setIsFrameLoading(false)}
					onError={() => setIsFrameLoading(false)}
				/>
			)}
		</div>
	);
};
