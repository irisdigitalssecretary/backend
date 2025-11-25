import { CompanyRepository } from '../../domain/repositories/company.repository'
import { InMemoryCompanyRepository } from '../../tests/in-memory/in-memory.company.repository'
import { CompanyEntity } from '../../domain/entities/company.entity'
import { CompanyNotFoundError } from '../../../../shared/application/errors/company-not-found'
import { CompanyFactory } from '../../domain/factories/make-company-entity'
import { FindCompanyByUuidUseCase } from './find-company-by-uuid.use-case'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'

describe('FindCompanyByUuidUseCase', () => {
	let companyRepository: CompanyRepository
	let findCompanyByUuidUseCase: FindCompanyByUuidUseCase

	beforeEach(() => {
		companyRepository = new InMemoryCompanyRepository()
		findCompanyByUuidUseCase = new FindCompanyByUuidUseCase(
			companyRepository,
		)
	})

	it('should not be able to find a company if it does not exist', async () => {
		const result = await findCompanyByUuidUseCase.execute({
			uuid: 'non-existent-uuid',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CompanyNotFoundError)
		expect(result.value).toMatchObject({
			message: 'Empresa não encontrada.',
			statusCode: 404,
		})
		expect(companyRepository.companies.length).toBe(0)
	})

	it('should be able to find a company by uuid', async () => {
		const uuid = '123e4567-e89b-12d3-a456-426614174000'

		await companyRepository.create(
			CompanyFactory.reconstitute({
				uuid,
				name: 'Tech Company Inc',
				email: 'contact@techcompany.com',
				landline: '551135211980',
				phone: '5511988899090',
				address: '123 Tech Street, Suite 100',
				city: 'São Paulo',
				state: 'SP',
				countryId: 1,
				taxId: '01894147000135',
				businessArea: 'TECHNOLOGY',
				personType: PersonType.COMPANY,
			}),
		)

		expect(companyRepository.companies.length).toBe(1)

		const result = await findCompanyByUuidUseCase.execute({ uuid })

		expect(result.isRight()).toBe(true)

		if (!result.isRight()) {
			throw result.value
		}

		const company = result.value
		expect(company).toBeInstanceOf(CompanyEntity)
		expect(company).toMatchObject({
			uuid,
			email: 'contact@techcompany.com',
			name: 'Tech Company Inc',
		})
	})
})
