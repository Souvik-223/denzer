import { useEffect } from 'react';

import Prism from 'prismjs';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import './code-theme.css';

interface CodeViewProps {
	code: string;
	lang: string;
}

export const CodeView = ({ code, lang }: CodeViewProps) => {
	useEffect(() => {
		Prism.highlightAll();
	}, [code]);

	return (
		<pre className='m-0 rounded-none border-none bg-transparent p-2 text-xs'>
			{/* eslint-disable-next-line tailwindcss/no-custom-classname */}
			<code className={`language-${lang}`}>{code}</code>
		</pre>
	);
};
