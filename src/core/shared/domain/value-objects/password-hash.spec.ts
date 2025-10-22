import { BcryptHasher } from '@shared/infra/services/bcrypt-hasher'
import { PasswordHash } from './password-hash'
import { InvalidPasswordError } from '../errors/invalid-password'
import { Hasher } from '../infra/services/hasher'

describe('PasswordHash test', () => {
	let hasher: Hasher

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	it('should not be able to create an password with less than 8 characters', () => {
		void expect(
			async () => await PasswordHash.create('1234567', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should not be able to create an password with more than 16 characters', () => {
		void expect(
			async () =>
				await PasswordHash.create('Test@123456789101112131456', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should not be able to create an password without uppercase letter', () => {
		void expect(
			async () => await PasswordHash.create('12345678', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should not be able to create an password without number', () => {
		void expect(
			async () => await PasswordHash.create('abcdefgh', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should not be able to create an password without special character', () => {
		void expect(
			async () => await PasswordHash.create('abcdefgh132423', hasher),
		).rejects.toThrow(InvalidPasswordError)
	})

	it('should be able to create an password with all requirements', async () => {
		const password = 'Abcdefgh132423!'
		const passwordHash = await PasswordHash.create(password, hasher)
		expect(passwordHash).toBeInstanceOf(PasswordHash)
		expect(passwordHash.props.hashedPassword).toBeDefined()
		expect(passwordHash.props.hashedPassword).not.toBe(password)
		void expect(
			hasher.compare(password, passwordHash.props.hashedPassword ?? ''),
		).resolves.toBe(true)
	})
})
