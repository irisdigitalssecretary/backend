import { Entity } from '@/core/shared/domain/base/entity'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { Email } from '@/core/shared/domain/value-objects/email'
import { Landline } from '@/core/shared/domain/value-objects/landline'
import { Phone } from '@/core/shared/domain/value-objects/phone'
import { UniqueEntityId } from '@/core/shared/domain/value-objects/unique-entity-id'
import { CompanyDescription } from '../value-objects/company-description'
import { TaxId } from '@/core/shared/domain/value-objects/tax-id'
import { ZipCode } from '@/core/shared/domain/value-objects/zip-code'

export interface CompanyEntityProps {
	id?: number
	uuid?: string
	name: string
	email: Email
	landline?: Landline
	phone?: Phone
	address: string
	city: string
	state: string
	zip?: ZipCode
	countryId: number
	taxId: TaxId
	description?: CompanyDescription
	businessArea: string
	personType: PersonType
}

export class CompanyEntity extends Entity<CompanyEntityProps> {
	public static create(
		props: CompanyEntityProps,
		id?: UniqueEntityId,
	): CompanyEntity {
		return new CompanyEntity({}, id ?? UniqueEntityId.create())
	}

	public static restore(props: CompanyEntityProps): CompanyEntity {
		return new CompanyEntity(props, UniqueEntityId.create(props.uuid))
	}
}
