import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { Password } from './password'
import { InvalidPasswordError } from '../errors/invalid-password-error'
import { Hasher } from '../infra/services/crypt/hasher'

describe('Password test', () => {
	let hasher: Hasher

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	it('should not be able to create a password with less than 8 characters', () => {
		void expect(
			async () => await Password.create('1234567', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should not be able to create a password with more than 16 characters', () => {
		void expect(
			async () =>
				await Password.create('Test@123456789101112131456', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should not be able to create a password without uppercase letter', () => {
		void expect(
			async () => await Password.create('12345678', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should not be able to create a password without number', () => {
		void expect(
			async () => await Password.create('abcdefgh', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should not be able to create a password without special character', () => {
		void expect(
			async () => await Password.create('abcdefgh132423', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should be able to create a password with all requirements', async () => {
		const password = 'Abcdefgh132423!'
		const passwordHash = await Password.create(password, hasher)

		expect(passwordHash).toBeInstanceOf(Password)
		expect(passwordHash!.props.hashedPassword).toBeDefined()
		expect(passwordHash!.props.hashedPassword).not.toBe(password)
		void expect(
			hasher.compare(password, passwordHash!.props.hashedPassword ?? ''),
		).resolves.toBe(true)
	})
})
