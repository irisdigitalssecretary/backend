import { InvalidLandlineError } from '../errors/invalid-landline-error'
import { Landline } from './landline'

describe('Landline value object test', () => {
	it('should be able to create a valid landline', () => {
		const landline = Landline.create('11999999999')
		expect(landline).toBeInstanceOf(Landline)
	})

	it('should not be able to create an landline with less than 10 characters', () => {
		expect(() => Landline.create('123456789')).toThrow(InvalidLandlineError)
	})

	it('should not be able to create an landline with more than 16 characters', () => {
		expect(() => Landline.create('12345678901234567')).toThrow(
			InvalidLandlineError,
		)
	})
})
