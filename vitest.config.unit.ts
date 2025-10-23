import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
	test: {
		globals: true,
		include: ['**/*.spec.ts'],
	},
	resolve: {
		alias: {
			'@shared': path.resolve(__dirname, './src/core/shared'),
			'@': path.resolve(__dirname, './src'),
		},
	},
})
