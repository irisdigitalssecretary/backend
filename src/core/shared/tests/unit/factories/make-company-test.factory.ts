import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import {
	CompanyFactory,
	MakeCompanyEntityProps,
} from '@/core/contexts/company/domain/factories/make-company-entity'
import { TaxIdValidatorService } from '@/core/shared/infra/services/validators/tax-id-validator.service'
import { ZipCodeValidatorService } from '@/core/shared/infra/services/validators/zip-code-validator.service'
import { InMemoryCompanyRepository } from '@/core/contexts/company/tests/in-memory/in-memory.company.repository'

export const makeCompany = async (props?: Partial<MakeCompanyEntityProps>) => {
	const companyRepository = new InMemoryCompanyRepository()
	const taxIdValidator = new TaxIdValidatorService()
	const zipCodeValidator = new ZipCodeValidatorService()

	return await companyRepository.create(
		CompanyFactory.create(
			{
				...props,
				name: props?.name ?? 'Company 1',
				email: props?.email ?? 'company1@example.com',
				taxId: props?.taxId ?? '01894147000135',
				address: props?.address ?? '123 Main St',
				city: props?.city ?? 'Anytown',
				state: props?.state ?? 'Rio de Janeiro',
				countryId: props?.countryId ?? 1,
				businessArea: props?.businessArea ?? 'Technology',
				personType: props?.personType ?? PersonType.COMPANY,
				zip: props?.zip ?? '89160306',
				landline: props?.landline ?? '551135211980',
				phone: props?.phone ?? '5511988899090',
				description:
					props?.description ?? 'Company 1 description is valid!',
			},
			{
				taxIdValidator,
				zipCodeValidator,
				countryCode: 'BR',
			},
		),
	)
}
