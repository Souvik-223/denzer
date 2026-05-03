import type { Metadata } from 'next';

import { PricingView } from '@/modules/pricing/ui/views/pricing-view';

export const metadata: Metadata = {
	description:
		'Explore our suite of carefully tailored subscription plans—each designed for different needs and ambitions. Evaluate the included features, compare details, and select only the plan that aligns perfectly with your workflow and desired level of support.',
	title: 'Pricing',
};

const PricingPage = () => {
	return <PricingView />;
};

export default PricingPage;
