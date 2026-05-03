import type { PropsWithChildren } from 'react';

import { Navbar } from '@/modules/home/ui/components/navbar';

const HomeLayout = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<main className='flex max-h-screen min-h-screen flex-col'>
			<Navbar />

			<div className='bg-background absolute inset-0 -z-10 size-full bg-[radial-gradient(#dadde2_1px,_transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#393e4a_1px,_transparent_1px)]' />
			<div className='flex flex-1 flex-col px-4 pb-4'>{children}</div>
		</main>
	);
};

export default HomeLayout;
