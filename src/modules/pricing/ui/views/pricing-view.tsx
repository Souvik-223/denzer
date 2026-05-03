'use client';

import { PricingTable } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export const PricingView = () => {
	const { resolvedTheme } = useTheme();

	return (
		<div className='mx-auto flex w-full max-w-3xl flex-col'>
			<section className='space-y-6 pt-[16vh] 2xl:pt-48'>
				<div className='flex flex-col items-center'>
					<img src='/logo.svg' alt='Vibe logo' width={50} height={50} className='hidden md:block' />
				</div>

				<h1 className='text-center text-xl font-bold md:text-3xl'>Pricing</h1>
				<p className='text-muted-foreground text-center text-sm md:text-base'>Choose the plan that fits your needs</p>

				<PricingTable
					appearance={{
						elements: {
							pricingTable: 'border-none! shadow-none! rounded-lg!',
						},
						theme: resolvedTheme === 'dark' ? dark : undefined,
					}}
					checkoutProps={{
						appearance: {
							elements: {
								drawerRoot: 'z-[99999]!',
							},
							theme: resolvedTheme === 'dark' ? dark : undefined,
						},
					}}
				/>
			</section>
		</div>
	);
};
