import { InMemoryCountryRepository } from '@/core/contexts/country/tests/in-memory/in-memory-country.repository'
import { InMemoryCompanyRepository } from '../../tests/in-memory/in-memory.company.repository'
import { CreateCompanyUseCase } from './create-company.use-case'
import { TaxIdValidator } from '@/core/shared/domain/infra/services/validators/tax-id-validator'
import { ZipCodeValidator } from '@/core/shared/domain/infra/services/validators/zip-code-validator'
import { TaxIdValidatorService } from '@/core/shared/infra/services/validators/tax-id-validator.service'
import { ZipCodeValidatorService } from '@/core/shared/infra/services/validators/zip-code-validator.service'
import { CompanyEntity } from '../../domain/entities/company.entity'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { CompanyTaxIdAlreadyExistsError } from '../errors/company-tax-id-already-exists'
import { CompanyEmailAlreadyExistsError } from '../errors/company-email-already-exists'
import { CountryNotFoundError } from '@/core/shared/application/errors/country-not-found'
import { InvalidEmailError } from '@/core/shared/domain/errors/invalid-email-error'
import { TaxIdInvalidError } from '@/core/shared/domain/errors/tax-id-invalid-error'
import { InvalidPhoneError } from '@/core/shared/domain/errors/invalid-phone-error'
import { InvalidLandlineError } from '@/core/shared/domain/errors/invalid-landline-error'
import { ZipCodeInvalidError } from '@/core/shared/domain/errors/zip-code-invalid-error'
import { TooShortCompanyAdressError } from '../../domain/errors/too-short-company-address'
import { TooLongCompanyAdressError } from '../../domain/errors/too-long-company-address'
import { TooShortCompanyDescriptionError } from '../../domain/errors/too-short-company-description'
import { TooLongCompanyDescriptionError } from '../../domain/errors/too-long-company-description'
import { CompanyBusinessArea } from '@/core/shared/domain/constants/company/company-business-area.enum'
import { LandlineOrPhoneIsRequiredError } from '../../domain/errors/landline-or-phone-is-required'

describe('CreateCompanyUseCase', () => {
	let companyRepository: InMemoryCompanyRepository
	let countryRepository: InMemoryCountryRepository
	let taxIdValidator: TaxIdValidator
	let zipCodeValidator: ZipCodeValidator
	let createCompanyUseCase: CreateCompanyUseCase

	beforeEach(() => {
		companyRepository = new InMemoryCompanyRepository()
		countryRepository = new InMemoryCountryRepository()
		taxIdValidator = new TaxIdValidatorService()
		zipCodeValidator = new ZipCodeValidatorService()
		createCompanyUseCase = new CreateCompanyUseCase(
			companyRepository,
			countryRepository,
			taxIdValidator,
			zipCodeValidator,
		)
	})

	it('should be able to create a new company', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company1@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: 'Technology',
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			zip: '89160306',
			landline: '551135211980',
			phone: '5511988899090',
			description: 'Company 1 description is valid!',
		})

		const company = companyRepository.companies[0]
		expect(result.isRight()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyEntity)
		expect(company).toBeInstanceOf(CompanyEntity)
		expect(company).toMatchObject({
			id: {
				value: expect.any(String),
			},
			name: 'Company 1',
			email: 'company1@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			phone: '5511988899090',
			landline: '551135211980',
			zip: '89160306',
			businessArea: 'Technology',
			personType: PersonType.COMPANY,
		})
	})

	it('should not be able to create a company if taxId already exists', async () => {
		await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company1@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: 'Technology',
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			zip: '89160306',
			landline: '551135211980',
			phone: '5511988899090',
		})

		const result = await createCompanyUseCase.execute({
			name: 'Company 2',
			email: 'company2@example.com',
			taxId: '01894147000135',
			address: '456 Other St',
			city: 'Othertown',
			state: 'Rio de Janeiro',
			businessArea: 'Finance',
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			zip: '89160307',
			landline: '551135211981',
			phone: '5511988899091',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyTaxIdAlreadyExistsError)
		expect(result.value).toMatchObject({
			message: 'Já existe uma empresa com este código fiscal cadastrado',
			statusCode: 409,
		})
		expect(companyRepository.companies.length).toBe(1)
	})

	it('should not be able to create a company if email already exists', async () => {
		await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company1@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: 'Technology',
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			zip: '89160306',
			landline: '551135211980',
			phone: '5511988899090',
		})

		const result = await createCompanyUseCase.execute({
			name: 'Company 2',
			email: 'company1@example.com',
			taxId: '15225632964',
			address: '456 Other St',
			city: 'Othertown',
			state: 'Rio de Janeiro',
			businessArea: 'Finance',
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			zip: '89160307',
			landline: '551135211981',
			phone: '5511988899091',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyEmailAlreadyExistsError)
		expect(result.value).toMatchObject({
			message: 'Já existe uma empresa com este email cadastrado',
			statusCode: 409,
		})
		expect(companyRepository.companies.length).toBe(1)
	})

	it('should not be able to create a company if country is not found', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company1@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'XX',
			zip: '89160306',
			landline: '551135211980',
			phone: '5511988899090',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CountryNotFoundError)
		expect(result.value).toMatchObject({
			message: 'País não encontrado.',
			statusCode: 404,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company with an invalid email', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'invalid-email',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			zip: '89160306',
		})
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidEmailError)
		expect(result.value).toMatchObject({
			message: 'E-mail inválido',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company with an invalid taxId', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company@example.com',
			taxId: '123',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			zip: '89160306',
		})
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TaxIdInvalidError)
		expect(result.value).toMatchObject({
			message: 'Código de identificação fiscal inválido',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company with an invalid phone', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			phone: '123',
		})
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPhoneError)
		expect(result.value).toMatchObject({
			message: 'Telefone deve possuir no mínimo 10 caracteres.',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company with an invalid landline', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			landline: '123',
		})
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidLandlineError)
		expect(result.value).toMatchObject({
			message: 'Telefone fixo deve possuir no mínimo 10 caracteres.',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company with an invalid zip code', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			zip: '123',
		})
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ZipCodeInvalidError)
		expect(result.value).toMatchObject({
			message: 'Código postal inválido',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company if the address is too short', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company@example.com',
			taxId: '01894147000135',
			address: 'a',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'BR',
		})
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TooShortCompanyAdressError)
		expect(result.value).toMatchObject({
			message:
				'A endereço da empresa deve possuir no mínimo 20 caracteres.',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company if the address is too long', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company@example.com',
			taxId: '01894147000135',
			address: 'a'.repeat(256),
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'BR',
		})
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TooLongCompanyAdressError)
		expect(result.value).toMatchObject({
			message:
				'A endereço da empresa deve possuir no máximo 255 caracteres.',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company if the description is too short', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			description: 'a',
		})
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TooShortCompanyDescriptionError)
		expect(result.value).toMatchObject({
			message:
				'A descrição da empresa deve possuir no mínimo 20 caracteres.',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company if the description is too long', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			description: 'a'.repeat(501),
		})
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TooLongCompanyDescriptionError)
		expect(result.value).toMatchObject({
			message:
				'A descrição da empresa deve possuir no máximo 255 caracteres.',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should not be able to create a company if the landline and phone are not provided', async () => {
		const result = await createCompanyUseCase.execute({
			name: 'Company 1',
			email: 'company1@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: 'Technology',
			personType: PersonType.COMPANY,
			countryCode: 'BR',
			zip: '89160306',
			description: 'Company 1 description is valid!',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(LandlineOrPhoneIsRequiredError)
		expect(result.value).toMatchObject({
			message:
				'O telefone fixo ou o telefone celular da empresa é obrigatório.',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(0)
	})
})
