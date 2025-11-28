import { InMemoryCountryRepository } from '@/core/contexts/country/tests/in-memory/in-memory-country.repository'
import { InMemoryCompanyRepository } from '../../tests/in-memory/in-memory.company.repository'
import { UpdateCompanyUseCase } from './update-company.use-case'
import { TaxIdValidator } from '@/core/shared/domain/infra/services/validators/tax-id-validator'
import { ZipCodeValidator } from '@/core/shared/domain/infra/services/validators/zip-code-validator'
import { TaxIdValidatorService } from '@/core/shared/infra/services/validators/tax-id-validator.service'
import { ZipCodeValidatorService } from '@/core/shared/infra/services/validators/zip-code-validator.service'
import { CompanyEntity } from '../../domain/entities/company.entity'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { CompanyNotFoundError } from '@/core/shared/application/errors/company-not-found'
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
import { CompanyFactory } from '../../domain/factories/make-company-entity'
import { CompanyBusinessArea } from '@/core/shared/domain/constants/company/company-business-area.enum'
import { LandlineOrPhoneIsRequiredError } from '../../domain/errors/landline-or-phone-is-required'

describe('UpdateCompanyUseCase', () => {
	let companyRepository: InMemoryCompanyRepository
	let countryRepository: InMemoryCountryRepository
	let taxIdValidator: TaxIdValidator
	let zipCodeValidator: ZipCodeValidator
	let updateCompanyUseCase: UpdateCompanyUseCase
	let company: CompanyEntity

	beforeEach(async () => {
		companyRepository = new InMemoryCompanyRepository()
		countryRepository = new InMemoryCountryRepository()
		taxIdValidator = new TaxIdValidatorService()
		zipCodeValidator = new ZipCodeValidatorService()
		updateCompanyUseCase = new UpdateCompanyUseCase(
			companyRepository,
			countryRepository,
			taxIdValidator,
			zipCodeValidator,
		)

		company = await companyRepository.create(
			CompanyFactory.create(
				{
					name: 'Company 1',
					email: 'company1@example.com',
					taxId: '01894147000135',
					address: '123 Main St',
					city: 'Anytown',
					state: 'Rio de Janeiro',
					countryId: 1,
					businessArea: 'Technology',
					personType: PersonType.COMPANY,
					zip: '89160306',
					landline: '551135211980',
					phone: '5511988899090',
					description: 'Company 1 description is valid!',
				},
				{
					taxIdValidator,
					zipCodeValidator,
					countryCode: 'BR',
				},
			),
		)
	})

	it('should be able to update a company', async () => {
		await companyRepository.create(
			CompanyFactory.create(
				{
					name: 'Company 2',
					email: 'company2@example.com',
					taxId: '01894147000216',
					address: '123 Main St',
					city: 'Anytown',
					state: 'Rio de Janeiro',
					countryId: 1,
					businessArea: 'Technology',
					personType: PersonType.COMPANY,
					zip: '89160306',
					landline: '551135211980',
					phone: '5511988899090',
					description: 'Company 2 description is valid!',
				},
				{
					taxIdValidator,
					zipCodeValidator,
					countryCode: 'BR',
				},
			),
		)

		const newData = {
			name: 'Company 3',
			email: 'company3@example.com',
			taxId: '15225632963',
			address: 'Rua das Flores, 123',
			city: 'São Paulo',
			state: 'São Paulo',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.INDIVIDUAL,
			countryCode: 'BR',
			zip: '89160306',
			landline: '551135211980',
			phone: '5511988899090',
			description: 'Company 3 description is valid!',
		}

		const result = await updateCompanyUseCase.execute(
			newData,
			company.props.id as number,
		)

		const updatedCompany = companyRepository.companies[0]

		expect(result.isRight()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyEntity)
		expect(companyRepository.companies.length).toBe(2)
		expect(updatedCompany).toMatchObject({
			name: newData.name,
			email: newData.email,
			taxId: newData.taxId,
			address: newData.address,
			city: newData.city,
			state: newData.state,
			businessArea: newData.businessArea,
			personType: newData.personType,
			zip: newData.zip,
			landline: newData.landline,
			phone: newData.phone,
			description: newData.description,
		})
	})

	it('should not be able to update a company if it does not exist', async () => {
		const nonExistentId = 999

		const result = await updateCompanyUseCase.execute(
			{
				name: 'Company 1',
				email: 'company1@example.com',
				taxId: '01894147000135',
				address: '123 Main St',
				city: 'Anytown',
				state: 'Rio de Janeiro',
				businessArea: CompanyBusinessArea.TECHNOLOGY,
				personType: PersonType.COMPANY,
				countryCode: 'BR',
				zip: '89160306',
				landline: '551135211980',
				phone: '5511988899090',
			},
			nonExistentId,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyNotFoundError)
		expect(result.value).toMatchObject({
			message: 'Empresa não encontrada.',
			statusCode: 404,
		})
	})

	it('should not be able to update a company if taxId already exists', async () => {
		await companyRepository.create(
			CompanyFactory.create(
				{
					name: 'Company 2',
					email: 'company2@example.com',
					taxId: '01894147000216',
					address: '456 Other St',
					city: 'Othertown',
					state: 'Rio de Janeiro',
					countryId: 1,
					businessArea: 'Finance',
					personType: PersonType.COMPANY,
					zip: '89160307',
					landline: '551135211981',
					phone: '5511988899091',
				},
				{
					taxIdValidator,
					zipCodeValidator,
					countryCode: 'BR',
				},
			),
		)

		const result = await updateCompanyUseCase.execute(
			{
				name: 'Company 1 Updated',
				email: 'company1@example.com',
				taxId: '01894147000216', // Using other company's taxId
				address: '123 Main St',
				city: 'Anytown',
				state: 'Rio de Janeiro',
				businessArea: CompanyBusinessArea.TECHNOLOGY,
				personType: PersonType.COMPANY,
				countryCode: 'BR',
				zip: '89160306',
				landline: '551135211980',
				phone: '5511988899090',
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyTaxIdAlreadyExistsError)
		expect(result.value).toMatchObject({
			message: 'Já existe uma empresa com este código fiscal cadastrado',
			statusCode: 409,
		})
	})

	it('should not be able to update a company if email already exists', async () => {
		await companyRepository.create(
			CompanyFactory.create(
				{
					name: 'Company 2',
					email: 'company2@example.com',
					taxId: '01894147000216',
					address: '456 Other St',
					city: 'Othertown',
					state: 'Rio de Janeiro',
					countryId: 1,
					businessArea: 'Finance',
					personType: PersonType.COMPANY,
					zip: '89160307',
					landline: '551135211981',
					phone: '5511988899091',
				},
				{
					taxIdValidator,
					zipCodeValidator,
					countryCode: 'BR',
				},
			),
		)

		const result = await updateCompanyUseCase.execute(
			{
				name: 'Company 1 Updated',
				email: 'company2@example.com', // Using other company's email
				taxId: '15225632964',
				address: '123 Main St',
				city: 'Anytown',
				state: 'Rio de Janeiro',
				businessArea: CompanyBusinessArea.TECHNOLOGY,
				personType: PersonType.COMPANY,
				countryCode: 'BR',
				zip: '89160306',
				landline: '551135211980',
				phone: '5511988899090',
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyEmailAlreadyExistsError)
		expect(result.value).toMatchObject({
			message: 'Já existe uma empresa com este email cadastrado',
			statusCode: 409,
		})
	})

	it('should not be able to update a company if country is not found', async () => {
		const result = await updateCompanyUseCase.execute(
			{
				name: 'Company 1',
				email: 'company1@example.com',
				taxId: '01894147000135',
				address: '123 Main St',
				city: 'Anytown',
				state: 'Rio de Janeiro',
				businessArea: CompanyBusinessArea.TECHNOLOGY,
				personType: PersonType.COMPANY,
				countryCode: 'XX', // Invalid country code
				zip: '89160306',
				landline: '551135211980',
				phone: '5511988899090',
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CountryNotFoundError)
		expect(result.value).toMatchObject({
			message: 'País não encontrado.',
			statusCode: 404,
		})
	})

	it('should not be able to update a company with an invalid email', async () => {
		const result = await updateCompanyUseCase.execute(
			{
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
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidEmailError)
		expect(result.value).toMatchObject({
			message: 'E-mail inválido',
			statusCode: 400,
		})
	})

	it('should not be able to update a company with an invalid taxId', async () => {
		const result = await updateCompanyUseCase.execute(
			{
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
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TaxIdInvalidError)
		expect(result.value).toMatchObject({
			message: 'Código de identificação fiscal inválido',
			statusCode: 400,
		})
	})

	it('should not be able to update a company with an invalid phone', async () => {
		const result = await updateCompanyUseCase.execute(
			{
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
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPhoneError)
		expect(result.value).toMatchObject({
			message: 'Telefone deve possuir no mínimo 10 caracteres.',
			statusCode: 400,
		})
	})

	it('should not be able to update a company with an invalid landline', async () => {
		const result = await updateCompanyUseCase.execute(
			{
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
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidLandlineError)
		expect(result.value).toMatchObject({
			message: 'Telefone fixo deve possuir no mínimo 10 caracteres.',
			statusCode: 400,
		})
	})

	it('should not be able to update a company with an invalid zip code', async () => {
		const result = await updateCompanyUseCase.execute(
			{
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
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ZipCodeInvalidError)
		expect(result.value).toMatchObject({
			message: 'Código postal inválido',
			statusCode: 400,
		})
	})

	it('should not be able to update a company if the address is too short', async () => {
		const result = await updateCompanyUseCase.execute(
			{
				name: 'Company 1',
				email: 'company@example.com',
				taxId: '01894147000135',
				address: 'a',
				city: 'Anytown',
				state: 'Rio de Janeiro',
				businessArea: CompanyBusinessArea.TECHNOLOGY,
				personType: PersonType.COMPANY,
				countryCode: 'BR',
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TooShortCompanyAdressError)
		expect(result.value).toMatchObject({
			message:
				'O endereço da empresa deve possuir no mínimo 10 caracteres.',
			statusCode: 400,
		})
	})

	it('should not be able to update a company if the address is too long', async () => {
		const result = await updateCompanyUseCase.execute(
			{
				name: 'Company 1',
				email: 'company@example.com',
				taxId: '01894147000135',
				address: 'a'.repeat(256),
				city: 'Anytown',
				state: 'Rio de Janeiro',
				businessArea: CompanyBusinessArea.TECHNOLOGY,
				personType: PersonType.COMPANY,
				countryCode: 'BR',
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TooLongCompanyAdressError)
		expect(result.value).toMatchObject({
			message:
				'O endereço da empresa deve possuir no máximo 255 caracteres.',
			statusCode: 400,
		})
	})

	it('should not be able to update a company if the description is too short', async () => {
		const result = await updateCompanyUseCase.execute(
			{
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
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TooShortCompanyDescriptionError)
		expect(result.value).toMatchObject({
			message:
				'A descrição da empresa deve possuir no mínimo 20 caracteres.',
			statusCode: 400,
		})
	})

	it('should not be able to update a company if the description is too long', async () => {
		const result = await updateCompanyUseCase.execute(
			{
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
			},
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(TooLongCompanyDescriptionError)
		expect(result.value).toMatchObject({
			message:
				'A descrição da empresa deve possuir no máximo 255 caracteres.',
			statusCode: 400,
		})
	})

	it('should not be able to update a company if the landline and phone are not provided', async () => {
		await companyRepository.create(
			CompanyFactory.create(
				{
					name: 'Company 2',
					email: 'company2@example.com',
					taxId: '01894147000216',
					address: '123 Main St',
					city: 'Anytown',
					state: 'Rio de Janeiro',
					countryId: 1,
					businessArea: 'Technology',
					personType: PersonType.COMPANY,
					zip: '89160306',
					landline: '551135211980',
					phone: '5511988899090',
					description: 'Company 2 description is valid!',
				},
				{
					taxIdValidator,
					zipCodeValidator,
					countryCode: 'BR',
				},
			),
		)

		const newData = {
			name: 'Company 3',
			email: 'company3@example.com',
			taxId: '15225632963',
			address: 'Rua das Flores, 123',
			city: 'São Paulo',
			state: 'São Paulo',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.INDIVIDUAL,
			countryCode: 'BR',
			zip: '89160306',
			description: 'Company 3 description is valid!',
		}

		const result = await updateCompanyUseCase.execute(
			newData,
			company.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(LandlineOrPhoneIsRequiredError)
		expect(result.value).toMatchObject({
			message:
				'É necessário informar o telefone fixo ou o telefone celular da empresa.',
			statusCode: 400,
		})
		expect(companyRepository.companies.length).toBe(2)
	})
})
