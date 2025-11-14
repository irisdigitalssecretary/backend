import { CompanyAdress } from './company-adress'
import { TooShortCompanyAdressError } from '../errors/too-short-company-address'
import { TooLongCompanyAdressError } from '../errors/too-long-company-address'

describe('CompanyAdress', () => {
	it('should create a valid CompanyAdress', () => {
		const address = 'Rua das Flores, 123, Centro, São Paulo - SP'

		const companyAdress = CompanyAdress.create(address)

		expect(companyAdress).toBeInstanceOf(CompanyAdress)
		expect(companyAdress.props.value).toBe(address)
	})

	it('should throw TooShortCompanyAdressError when address has less than 20 characters', () => {
		const address = 'Rua Curta'

		expect(() => CompanyAdress.create(address)).toThrow(
			TooShortCompanyAdressError,
		)
	})

	it('should throw TooLongCompanyAdressError when address has more than 255 characters', () => {
		const address = 'A'.repeat(256)

		expect(() => CompanyAdress.create(address)).toThrow(
			TooLongCompanyAdressError,
		)
	})
})
