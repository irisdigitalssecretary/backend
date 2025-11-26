import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { TaxIdValidator } from '@/core/shared/domain/infra/services/validators/tax-id-validator'
import { ZipCodeValidator } from '@/core/shared/domain/infra/services/validators/zip-code-validator'
import {
	CompanyFactory,
	MakeCompanyEntityProps,
} from '@/core/contexts/company/domain/factories/make-company-entity'

export const makeCompany = (
	taxIdValidator: TaxIdValidator,
	zipCodeValidator: ZipCodeValidator,
	props?: Partial<MakeCompanyEntityProps>,
) => {
	return CompanyFactory.create(
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
	)
}
