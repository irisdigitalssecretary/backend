import { Email } from '@/core/shared/domain/value-objects/email'
import { Landline } from '@/core/shared/domain/value-objects/landline'
import { Phone } from '@/core/shared/domain/value-objects/phone'
import { TaxId } from '@/core/shared/domain/value-objects/tax-id'
import { ZipCode } from '@/core/shared/domain/value-objects/zip-code'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { TaxIdValidator } from '@/core/shared/domain/infra/services/validators/tax-id-validator'
import { ZipCodeValidator } from '@/core/shared/domain/infra/services/validators/zip-code-validator'
import { CompanyEntity } from '../entities/company.entity'
import { CompanyDescription } from '../value-objects/company-description'
import { CompanyAdress } from '../value-objects/company-adress'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'
import { CompanyBusinessArea } from '@/core/shared/domain/constants/company/company-business-area.enum'

export interface MakeCompanyEntityProps {
	id?: number
	uuid?: string
	name: string
	email: string
	landline?: string
	phone?: string
	address: string
	city: string
	state: string
	zip?: string
	countryId: number
	taxId: string
	description?: string
	businessArea: string
	personType?: PersonType
	status?: CompanyStatus
	createdAt?: Date
	updatedAt?: Date
}

interface CompanyFactoryDependencies {
	taxIdValidator: TaxIdValidator
	zipCodeValidator: ZipCodeValidator
	countryCode: string
}

export class CompanyFactory {
	static create(
		props: MakeCompanyEntityProps,
		dependencies: CompanyFactoryDependencies,
	) {
		const email = Email.create(props.email)
		const landline = props.landline
			? Landline.create(props.landline)
			: undefined
		const phone = props.phone ? Phone.create(props.phone) : undefined
		const zip = props.zip
			? ZipCode.create(
					{ value: props.zip, countryCode: dependencies.countryCode },
					dependencies.zipCodeValidator,
				)
			: undefined
		const taxId = TaxId.create(
			{ code: props.taxId, countryCode: dependencies.countryCode },
			dependencies.taxIdValidator,
		)

		const description = props.description
			? CompanyDescription.create(props.description)
			: undefined
		const address = CompanyAdress.create(props.address)

		return CompanyEntity.create({
			...props,
			id: props.id,
			uuid: props.uuid,
			name: props.name,
			email,
			landline,
			phone,
			address,
			city: props.city,
			state: props.state,
			zip,
			countryId: props.countryId,
			taxId,
			description,
			businessArea:
				CompanyBusinessArea[props.businessArea?.toUpperCase()],
		})
	}

	static reconstitute(props: MakeCompanyEntityProps) {
		const personType = props.personType ?? PersonType.INDIVIDUAL
		return CompanyEntity.restore({
			...props,
			email: Email.restore(props.email),
			landline: props.landline
				? Landline.restore(props.landline)
				: undefined,
			phone: props.phone ? Phone.restore(props.phone) : undefined,
			zip: props.zip ? ZipCode.restore(props.zip) : undefined,
			taxId: TaxId.restore(props.taxId),
			description: props.description
				? CompanyDescription.restore(props.description)
				: undefined,
			personType,
			address: CompanyAdress.restore(props.address),
			businessArea:
				CompanyBusinessArea[props.businessArea?.toUpperCase()],
		})
	}
}
