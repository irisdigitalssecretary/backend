import { InvalidPhoneError } from '../errors/invalid-phone'
import { Phone } from './phone'

describe('Phone value object test', () => {
	it('should be able to create a valid phone', () => {
		const phone = Phone.create('11999999999')
		expect(phone).toBeInstanceOf(Phone)
	})

	it('should not be able to create an phone with less than 10 characters', () => {
		expect(() => Phone.create('123456789')).toThrow(InvalidPhoneError)
	})

	it('should not be able to create an phone with more than 16 characters', () => {
		expect(() => Phone.create('12345678901234567')).toThrow(
			InvalidPhoneError,
		)
	})
})
