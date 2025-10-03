import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
	test: {
		globals: true,
		globalSetup: './src/core/shared/infra/tests/setup.ts',
	},
	resolve: {
		alias: {
			'@shared': path.resolve(__dirname, './src/core/shared'),
			'@': path.resolve(__dirname, './src'),
		},
	},
})
