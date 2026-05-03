import dotenv from 'dotenv';
import { Template, defaultBuildLogger } from 'e2b';

import { template } from './template';

dotenv.config({ path: '.env.local' });

async function main() {
	await Template.build(template, `${process.env.E2B_SANDBOX_TEMPLATE_NAME}-dev`, {
		cpuCount: 2,
		memoryMB: 1024,
		onBuildLogs: defaultBuildLogger(),
	});
}

main().catch(console.error);
