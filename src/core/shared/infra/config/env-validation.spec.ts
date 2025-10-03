import { env, envSchema } from './env-validation'

describe('env validation test', () => {
	it('should be able to validate the env', () => {
		envSchema.parse(process.env)
		expect(env).toBeDefined()
		expect(env.APP_ENV).toBe('test')

		const envEntries = Object.entries(env)

		for (const [, value] of envEntries) {
			expect(value).toBeDefined()
		}
	})
})
