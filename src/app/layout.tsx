import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { cn } from '@/lib/utils';

import './globals.css';

import { Providers } from '@/components/providers';
import { SITE_CONFIG } from '@/config';

const inter = Inter({
	subsets: ['latin'],
});

export const metadata: Metadata = SITE_CONFIG;

export const viewport: Viewport = {
	themeColor: '#d97757',
};

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={cn(inter.className, 'antialiased')}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
