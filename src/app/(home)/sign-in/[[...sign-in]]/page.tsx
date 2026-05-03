import type { Metadata } from 'next';

import { SignInView } from '@/modules/auth/ui/views/sign-in-view';

export const metadata: Metadata = {
	description:
		'Access your Vibe account to manage projects, view personalized recommendations, and enjoy seamless collaboration. Sign in securely to unlock the full suite of productivity features tailored for creative professionals.',
	title: 'Sign In',
};

const SignInPage = () => {
	return <SignInView />;
};

export default SignInPage;
