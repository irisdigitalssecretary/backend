import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'

describe('BcryptHasher test', () => {
	it('should be able to hash a password', async () => {
		const hasher = new BcryptHasher()

		const password = '123456'
		const hashedPassword = await hasher.hash(password)

		expect(hashedPassword).toBeDefined()
		expect(hashedPassword).not.toBe(password)
	})
})
