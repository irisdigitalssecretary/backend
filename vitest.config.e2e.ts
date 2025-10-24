import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
	test: {
		globals: true,
		globalSetup: path.resolve(__dirname, './test/setup.e2e.ts'),
		include: ['**/*.spec.e2e.ts'],
		hookTimeout: 0,
	},
	resolve: {
		alias: {
			'@shared': path.resolve(__dirname, './src/core/shared'),
			'@': path.resolve(__dirname, './src'),
		},
	},
})
