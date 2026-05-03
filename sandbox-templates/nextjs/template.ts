import { Template, waitForURL } from 'e2b';

export const template = Template()
	.fromImage('node:24-slim')
	.setUser('root')

	// Install curl
	.runCmd('apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*')

	// Change working directory
	.setWorkdir('/home/user/nextjs-app')

	// Create Next.js app
	.runCmd('npx --yes create-next-app@16.1.6 . --yes')

	// Initialize shadcn and add all components
	.runCmd('npx --yes shadcn@3.8.5 init --yes -b neutral --force && npx --yes shadcn@3.8.5 add --all --yes')

	.runCmd('mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app')

	// Start Next.js app
	.setUser('user')
	.setWorkdir('/home/user')
	.setStartCmd('npm run dev', waitForURL('http://localhost:3000'));
