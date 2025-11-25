import { InMemoryCompanyRepository } from '../../tests/in-memory/in-memory.company.repository'
import { DeleteCompanyByIdUseCase } from './delete-company-by-id.use-case'
import { CompanyFactory } from '../../domain/factories/make-company-entity'
import { CompanyNotFoundError } from '@/core/shared/application/errors/company-not-found'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { CompanyBusinessArea } from '@/core/shared/domain/constants/company/company-business-area.enum'

describe('DeleteCompanyByIdUseCase', () => {
	let companyRepository: InMemoryCompanyRepository
	let deleteCompanyByIdUseCase: DeleteCompanyByIdUseCase

	beforeEach(() => {
		companyRepository = new InMemoryCompanyRepository()
		deleteCompanyByIdUseCase = new DeleteCompanyByIdUseCase(
			companyRepository,
		)
	})

	it('should be able to delete an existing company', async () => {
		const company = CompanyFactory.reconstitute({
			id: 1,
			name: 'Test Company',
			email: 'test@company.com',
			taxId: '01894147000135',
			address: 'Rua das Flores, 123 - Centro',
			city: 'São Paulo',
			state: 'São Paulo',
			businessArea: CompanyBusinessArea.TECHNOLOGY,
			personType: PersonType.COMPANY,
			countryId: 1,
			zip: '89160306',
			phone: '5511988899090',
			landline: '551135211980',
			description: 'Test company description',
		})

		await companyRepository.create(company)

		expect(companyRepository.companies).toHaveLength(1)
		expect(companyRepository.companies[0].id?.value).toBe(company.id!.value)

		const result = await deleteCompanyByIdUseCase.execute(1)

		expect(result.isRight()).toBe(true)
		expect(result.value).toBeNull()

		expect(companyRepository.companies).toHaveLength(0)

		const deletedCompany = await companyRepository.findById(1)
		expect(deletedCompany).toBeNull()
	})

	it('should not be able to delete a non-existent company', async () => {
		const result = await deleteCompanyByIdUseCase.execute(999)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyNotFoundError)
		expect(result.value).toMatchObject({
			message: 'Empresa não encontrada.',
			statusCode: 404,
		})
	})
})
