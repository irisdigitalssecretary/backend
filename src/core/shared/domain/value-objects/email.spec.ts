import { InvalidEmailError } from '../errors/invalid-email'
import { Email } from './email'

describe('Email value object test', () => {
	it('should be able to create a valid email', () => {
		const email = Email.create('test@test.com')
		expect(email).toBeInstanceOf(Email)
	})

	it('should not be able to create an invalid email', () => {
		expect(() => Email.create('test@test')).toThrow(InvalidEmailError)
	})

	it('should not be able to create an email with more than 100 characters', () => {
		expect(() => Email.create('a'.repeat(101) + '@gmail.com')).toThrow(
			InvalidEmailError,
		)
	})
})
