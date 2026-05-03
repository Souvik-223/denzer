'use client';

import Link from 'next/link';

import { AlertCircleIcon, HomeIcon, RotateCcwIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

const GlobalError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className='bg-background min-h-screen antialiased'>
				<div className='flex min-h-screen flex-col items-center justify-center px-8 py-4'>
					<div className='bg-sidebar flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
						<AlertCircleIcon className='text-destructive size-6' />

						<div className='flex flex-col gap-y-2 text-center'>
							<h6 className='text-lg font-medium'>Something went wrong!</h6>
							<p className='text-muted-foreground text-sm'>{error?.message ?? 'An unexpected error occurred.'}</p>
						</div>

						<div className='flex flex-wrap items-center justify-center gap-2'>
							<Button size='sm' onClick={() => reset()}>
								<RotateCcwIcon className='size-4' /> Retry
							</Button>

							<Button size='sm' variant='outline' asChild>
								<Link href='/'>
									<HomeIcon className='size-4' /> Home
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
};

export default GlobalError;
