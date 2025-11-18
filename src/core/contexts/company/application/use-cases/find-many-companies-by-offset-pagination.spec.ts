import { InMemoryCompanyRepository } from '../../tests/in-memory/in-memory.company.repository'
import { FindManyCompaniesByOffsetPaginationUseCase } from './find-many-companies-by-offset-pagination'
import { CompanyEntity } from '../../domain/entities/company.entity'
import { CompanyFactory } from '../../domain/factories/make-company-entity'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { CompanyBusinessArea } from '@/core/shared/domain/constants/company/company-business-area.enum'

describe('FindManyCompaniesByOffsetPaginationUseCase', () => {
	let companyRepository: InMemoryCompanyRepository
	let findManyCompaniesByOffsetPaginationUseCase: FindManyCompaniesByOffsetPaginationUseCase

	beforeEach(async () => {
		companyRepository = new InMemoryCompanyRepository()
		findManyCompaniesByOffsetPaginationUseCase =
			new FindManyCompaniesByOffsetPaginationUseCase(companyRepository)

		const testCompanies = [
			{
				id: 1,
				name: 'Acme Corporation',
				email: 'contact@acme.com',
				taxId: '01894147000135', // CNPJ válido do Brasil
				address: 'Rua das Flores, 123 - Centro',
				city: 'São Paulo',
				state: 'São Paulo',
				businessArea: CompanyBusinessArea.TECHNOLOGY,
				personType: PersonType.COMPANY,
				countryId: 1,
				countryCode: 'BR',
			},
			{
				id: 2,
				name: 'Beta Solutions',
				email: 'info@beta.com',
				taxId: '15225632963', // CPF válido do Brasil
				address: 'Avenida Paulista, 1000 - Bela Vista',
				city: 'São Paulo',
				state: 'São Paulo',
				businessArea: CompanyBusinessArea.FINANCE,
				personType: PersonType.INDIVIDUAL,
				countryId: 1,
				countryCode: 'BR',
			},
			{
				id: 3,
				name: 'Charlie Imports',
				email: 'contact@charlie.com',
				taxId: '12-3456789', // EIN válido dos EUA
				address: '123 Main Street',
				city: 'New York',
				state: 'New York',
				businessArea: CompanyBusinessArea.RETAIL,
				personType: PersonType.COMPANY,
				countryId: 2,
				countryCode: 'US',
			},
			{
				id: 4,
				name: 'Delta Marketing',
				email: 'hello@delta.com',
				taxId: '123456782', // SIN válido do Canadá
				address: '456 King Street',
				city: 'Toronto',
				state: 'Ontario',
				businessArea: CompanyBusinessArea.OTHER,
				personType: PersonType.INDIVIDUAL,
				countryId: 3,
				countryCode: 'CA',
			},
			{
				id: 5,
				name: 'Echo Industries',
				email: 'support@echo.test',
				taxId: '20123456786', // CUIT válido da Argentina
				address: 'Avenida Corrientes 2000',
				city: 'Buenos Aires',
				state: 'Buenos Aires',
				businessArea: CompanyBusinessArea.TECHNOLOGY,
				personType: PersonType.COMPANY,
				countryId: 4,
				countryCode: 'AR',
			},
		]

		for (const companyData of testCompanies) {
			const company = CompanyFactory.reconstitute({
				id: companyData.id,
				name: companyData.name,
				email: companyData.email,
				taxId: companyData.taxId,
				address: companyData.address,
				city: companyData.city,
				state: companyData.state,
				businessArea: companyData.businessArea,
				personType: companyData.personType,
				countryId: companyData.countryId,
				zip: '89160306',
				phone: '5511988899090',
				landline: '551135211980',
				description: `${companyData.name} is a great company operating in ${companyData.businessArea}`,
			})
			await companyRepository.create(company)
		}
	})

	describe('Pagination', () => {
		it('should be able to fetch companies with default pagination', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)
		})

		it('should be able to respect pagination limit', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					pagination: { limit: 2, page: 1 },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(2)
		})

		it('should be able to navigate between pages correctly', async () => {
			const firstPageResult =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					pagination: { limit: 2, page: 1 },
				})

			const secondPageResult =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					pagination: { limit: 2, page: 2 },
				})

			expect(firstPageResult.isRight()).toBe(true)
			expect(secondPageResult.isRight()).toBe(true)

			const firstPageCompanies = firstPageResult.value as CompanyEntity[]
			const secondPageCompanies =
				secondPageResult.value as CompanyEntity[]

			expect(firstPageCompanies).toHaveLength(2)
			expect(secondPageCompanies).toHaveLength(2)

			const firstPageIds = firstPageCompanies.map(
				(company) => company.uuid,
			)
			const secondPageIds = secondPageCompanies.map(
				(company) => company.uuid,
			)

			expect(firstPageIds).not.toEqual(secondPageIds)
		})

		it('should be able to return empty list when page exceeds total records', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					pagination: { limit: 10, page: 10 },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(0)
		})
	})

	describe('Filters', () => {
		it('should be able to filter companies by name', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { name: 'Acme' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(1)
			expect(companies[0].name).toContain('Acme')
		})

		it('should be able to filter companies by email', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { email: 'info@beta.com' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(1)
			expect(companies[0].email).toBe('info@beta.com')
		})

		it('should be able to filter companies by business area', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { businessArea: CompanyBusinessArea.TECHNOLOGY },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(2)
			companies.forEach((company) => {
				expect(company.businessArea).toBe(
					CompanyBusinessArea.TECHNOLOGY,
				)
			})
		})

		it('should be able to filter companies by person type', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { personType: PersonType.COMPANY },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(3)
			companies.forEach((company) => {
				expect(company.personType).toBe(PersonType.COMPANY)
			})
		})

		it('should be able to filter companies by city', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { city: 'São Paulo' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(2)
			companies.forEach((company) => {
				expect(company.city).toBe('São Paulo')
			})
		})

		it('should be able to filter companies by state', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { state: 'New York' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(1)
			expect(companies[0].state).toBe('New York')
		})

		it('should be able to filter companies by taxId', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { taxId: '15225632963' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(1)
			expect(companies[0].taxId).toBe('15225632963')
		})

		it('should be able to combine multiple filters', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {
						businessArea: CompanyBusinessArea.TECHNOLOGY,
						personType: PersonType.COMPANY,
					},
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(2)
			companies.forEach((company) => {
				expect(company.businessArea).toBe(
					CompanyBusinessArea.TECHNOLOGY,
				)
				expect(company.personType).toBe(PersonType.COMPANY)
			})
		})

		it('should be able to return empty list when no company matches filters', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { name: 'Empresa Inexistente' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(0)
		})
	})

	describe('Ordering', () => {
		it('should be able to sort companies by name in ascending order', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					orderBy: { name: 'asc' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)

			for (let i = 1; i < companies.length; i++) {
				expect(
					companies[i - 1].name.localeCompare(companies[i].name),
				).toBeLessThanOrEqual(0)
			}
		})

		it('should be able to sort companies by name in descending order', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					orderBy: { name: 'desc' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)

			for (let i = 1; i < companies.length; i++) {
				expect(
					companies[i - 1].name.localeCompare(companies[i].name),
				).toBeGreaterThanOrEqual(0)
			}
		})

		it('should be able to sort companies by email in ascending order', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					orderBy: { email: 'asc' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)

			for (let i = 1; i < companies.length; i++) {
				expect(
					companies[i - 1].email.localeCompare(companies[i].email),
				).toBeLessThanOrEqual(0)
			}
		})

		it('should be able to sort companies by businessArea', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					orderBy: { businessArea: 'asc' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)
		})

		it('should be able to sort companies by city', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					orderBy: { city: 'asc' },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)
		})
	})

	describe('Complex Combinations', () => {
		it('should be able to apply filters, ordering and pagination simultaneously', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { personType: PersonType.COMPANY },
					orderBy: { name: 'asc' },
					pagination: { limit: 2, page: 1 },
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(2)

			companies.forEach((company) => {
				expect(company.personType).toBe(PersonType.COMPANY)
			})

			expect(
				companies[0].name.localeCompare(companies[1].name),
			).toBeLessThanOrEqual(0)
		})

		it('should be able to work with empty filters', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)
		})

		it('should be able to work without optional parameters', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)
		})
	})

	describe('Select Fields', () => {
		it('should be able to select specific fields', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					select: ['name', 'email'],
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)

			companies.forEach((company) => {
				expect(company.name).toBeDefined()
				expect(company.email).toBeDefined()
			})
		})

		it('should be able to select only name field', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					select: ['name'],
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)

			companies.forEach((company) => {
				expect(company.name).toBeDefined()
			})
		})

		it('should be able to select only email field', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					select: ['email'],
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)

			companies.forEach((company) => {
				expect(company.email).toBeDefined()
			})
		})

		it('should be able to combine select with filters', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { businessArea: CompanyBusinessArea.TECHNOLOGY },
					select: ['name', 'email', 'businessArea'],
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(2)

			companies.forEach((company) => {
				expect(company.name).toBeDefined()
				expect(company.email).toBeDefined()
				expect(company.businessArea).toBe(
					CompanyBusinessArea.TECHNOLOGY,
				)
			})
		})

		it('should be able to combine select with pagination', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					pagination: { limit: 2, page: 1 },
					select: ['name', 'email'],
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(2)

			companies.forEach((company) => {
				expect(company.name).toBeDefined()
				expect(company.email).toBeDefined()
			})
		})

		it('should be able to combine select with ordering', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: {},
					orderBy: { name: 'asc' },
					select: ['name', 'email'],
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(5)

			companies.forEach((company) => {
				expect(company.name).toBeDefined()
				expect(company.email).toBeDefined()
			})

			for (let i = 1; i < companies.length; i++) {
				expect(
					companies[i - 1].name.localeCompare(companies[i].name),
				).toBeLessThanOrEqual(0)
			}
		})

		it('should be able to combine select with filters, pagination and ordering', async () => {
			const result =
				await findManyCompaniesByOffsetPaginationUseCase.execute({
					filters: { businessArea: CompanyBusinessArea.TECHNOLOGY },
					orderBy: { name: 'asc' },
					pagination: { limit: 2, page: 1 },
					select: ['name', 'email', 'businessArea'],
				})

			expect(result.isRight()).toBe(true)
			const companies = result.value as CompanyEntity[]
			expect(companies).toHaveLength(2)

			companies.forEach((company) => {
				expect(company.name).toBeDefined()
				expect(company.email).toBeDefined()
				expect(company.businessArea).toBe(
					CompanyBusinessArea.TECHNOLOGY,
				)
			})

			expect(
				companies[0].name.localeCompare(companies[1].name),
			).toBeLessThanOrEqual(0)
		})
	})
})
