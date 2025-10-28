import { defineConfig } from 'vitest/config'
import path from 'node:path'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
	test: {
		globals: true,
		globalSetup: path.resolve(__dirname, './test/setup.e2e.ts'),
		include: ['**/*.spec.e2e.ts'],
	},
	plugins: [
		react({
			tsDecorators: true,
			useAtYourOwnRisk_mutateSwcOptions(options) {
				options.jsc = {
					...options.jsc,
					parser: {
						...(options.jsc?.parser || {}),
						syntax: 'typescript',
						decorators: true,
					},
					transform: {
						...(options.jsc?.transform || {}),
						decoratorMetadata: true,
					},
				}
			},
		}),
	],
	resolve: {
		alias: {
			'@shared': path.resolve(__dirname, './src/core/shared'),
			'@': path.resolve(__dirname, './src'),
			'@config': path.resolve(__dirname, './src/core/infra/config'),
		},
	},
})
