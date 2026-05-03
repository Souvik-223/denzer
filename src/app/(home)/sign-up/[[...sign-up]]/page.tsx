import type { Metadata } from 'next';

import { SignUpView } from '@/modules/auth/ui/views/sign-up-view';

export const metadata: Metadata = {
	description:
		'Create your Vibe account to manage projects, view personalized recommendations, and enjoy seamless collaboration. Sign up now to unlock the full suite of productivity features tailored for creative professionals.',
	title: 'Sign Up',
};

const SignUpPage = () => {
	return <SignUpView />;
};

export default SignUpPage;
