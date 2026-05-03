'use client';

import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export const SignUpView = () => {
	const { resolvedTheme } = useTheme();

	return (
		<div className='mx-auto flex w-full max-w-3xl flex-col'>
			<section className='space-y-6 pt-[16vh] 2xl:pt-48'>
				<div className='flex flex-col items-center'>
					<SignUp
						appearance={{
							captcha: {
								theme: resolvedTheme === 'dark' ? 'dark' : 'light',
							},
							elements: {
								cardBox: 'border! shadow-none! rounded-lg!',
							},
							theme: resolvedTheme === 'dark' ? dark : undefined,
						}}
					/>
				</div>
			</section>
		</div>
	);
};
