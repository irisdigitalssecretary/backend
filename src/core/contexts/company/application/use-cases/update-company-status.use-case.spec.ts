import { InMemoryCompanyRepository } from '../../tests/in-memory/in-memory.company.repository'
import { CompanyRepository } from '../../domain/repositories/company.repository'
import { CompanyNotFoundError } from '@/core/shared/application/errors/company-not-found'
import { CompanyFactory } from '../../domain/factories/make-company-entity'
import { UpdateCompanyStatusUseCase } from './update-company-status.use-case'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { CompanyBusinessArea } from '@/core/shared/domain/constants/company/company-business-area.enum'

describe('UpdateCompanyStatusUseCase', () => {
	let companyRepository: CompanyRepository
	let updateCompanyStatusUseCase: UpdateCompanyStatusUseCase

	beforeEach(() => {
		companyRepository = new InMemoryCompanyRepository()
		updateCompanyStatusUseCase = new UpdateCompanyStatusUseCase(
			companyRepository,
		)
	})

	it('should not be able to update the company status if the company does not exist', async () => {
		const result = await updateCompanyStatusUseCase.execute({
			id: 999,
			status: CompanyStatus.INACTIVE,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyNotFoundError)
		expect(result.value).toMatchObject({
			message: 'Empresa não encontrada.',
			statusCode: 404,
		})
		expect(
			companyRepository.companies.find(
				(company) => company.props.id === 999,
			),
		).toBeUndefined()
	})

	it('should be able to update the company status by id', async () => {
		const company = await companyRepository.create(
			CompanyFactory.reconstitute({
				name: 'Acme Corporation',
				email: 'contact@acme.com',
				taxId: '01894147000135',
				address: 'Rua das Flores, 123 - Centro',
				city: 'São Paulo',
				state: 'São Paulo',
				businessArea: CompanyBusinessArea.TECHNOLOGY,
				personType: PersonType.COMPANY,
				countryId: 1,
			}),
		)

		expect(companyRepository.companies.length).toBe(1)

		const result = await updateCompanyStatusUseCase.execute({
			id: company.props.id as number,
			status: CompanyStatus.INACTIVE,
		})

		expect(result.isRight()).toBe(true)
		expect(companyRepository.companies.length).toBe(1)
		expect(companyRepository.companies[0].props.id).toBe(company.props.id)
		expect(companyRepository.companies[0].status).toBe(
			CompanyStatus.INACTIVE,
		)
	})

	it('should be able to update company status from INACTIVE to ACTIVE', async () => {
		const company = await companyRepository.create(
			CompanyFactory.reconstitute({
				name: 'Beta Solutions',
				email: 'info@beta.com',
				taxId: '15225632963',
				address: 'Avenida Paulista, 1000',
				city: 'São Paulo',
				state: 'São Paulo',
				businessArea: CompanyBusinessArea.FINANCE,
				personType: PersonType.INDIVIDUAL,
				countryId: 1,
				status: CompanyStatus.INACTIVE,
			}),
		)

		expect(company.status).toBe(CompanyStatus.INACTIVE)

		const result = await updateCompanyStatusUseCase.execute({
			id: company.props.id as number,
			status: CompanyStatus.ACTIVE,
		})

		expect(result.isRight()).toBe(true)
		expect(companyRepository.companies[0].status).toBe(CompanyStatus.ACTIVE)
	})

	it('should be able to update company status from ACTIVE to SUSPENDED', async () => {
		const company = await companyRepository.create(
			CompanyFactory.reconstitute({
				name: 'Charlie Imports',
				email: 'contact@charlie.com',
				taxId: '11222333000181',
				address: 'Rua do Comércio, 500',
				city: 'Rio de Janeiro',
				state: 'Rio de Janeiro',
				businessArea: CompanyBusinessArea.RETAIL,
				personType: PersonType.COMPANY,
				countryId: 1,
				status: CompanyStatus.ACTIVE,
			}),
		)

		expect(company.status).toBe(CompanyStatus.ACTIVE)

		const result = await updateCompanyStatusUseCase.execute({
			id: company.props.id as number,
			status: CompanyStatus.BLOCKED,
		})

		expect(result.isRight()).toBe(true)
		expect(companyRepository.companies[0].status).toBe(
			CompanyStatus.BLOCKED,
		)
	})

	it('should be able to update company status from SUSPENDED to ACTIVE', async () => {
		const company = await companyRepository.create(
			CompanyFactory.reconstitute({
				name: 'Delta Marketing',
				email: 'hello@delta.com',
				taxId: '11444777000161',
				address: 'Rua das Palmeiras, 789',
				city: 'São Paulo',
				state: 'São Paulo',
				businessArea: CompanyBusinessArea.OTHER,
				personType: PersonType.COMPANY,
				countryId: 1,
				status: CompanyStatus.BLOCKED,
			}),
		)

		expect(company.status).toBe(CompanyStatus.BLOCKED)

		const result = await updateCompanyStatusUseCase.execute({
			id: company.props.id as number,
			status: CompanyStatus.ACTIVE,
		})

		expect(result.isRight()).toBe(true)
		expect(companyRepository.companies[0].status).toBe(CompanyStatus.ACTIVE)
	})

	it('should maintain the same status when updating to the same status', async () => {
		const company = await companyRepository.create(
			CompanyFactory.reconstitute({
				name: 'Echo Industries',
				email: 'support@echo.com',
				taxId: '11555666000190',
				address: 'Avenida Industrial, 2000',
				city: 'Campinas',
				state: 'São Paulo',
				businessArea: CompanyBusinessArea.MANUFACTURING,
				personType: PersonType.COMPANY,
				countryId: 1,
				status: CompanyStatus.ACTIVE,
			}),
		)

		expect(company.status).toBe(CompanyStatus.ACTIVE)

		const result = await updateCompanyStatusUseCase.execute({
			id: company.props.id as number,
			status: CompanyStatus.ACTIVE,
		})

		expect(result.isRight()).toBe(true)
		expect(companyRepository.companies[0].status).toBe(CompanyStatus.ACTIVE)
	})
})
