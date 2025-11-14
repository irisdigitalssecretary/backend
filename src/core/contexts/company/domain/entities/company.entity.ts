import { Entity } from '@/core/shared/domain/base/entity'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { Email } from '@/core/shared/domain/value-objects/email'
import { Landline } from '@/core/shared/domain/value-objects/landline'
import { Phone } from '@/core/shared/domain/value-objects/phone'
import { UniqueEntityId } from '@/core/shared/domain/value-objects/unique-entity-id'
import { CompanyDescription } from '../value-objects/company-description'
import { TaxId } from '@/core/shared/domain/value-objects/tax-id'
import { ZipCode } from '@/core/shared/domain/value-objects/zip-code'
import { CompanyAdress } from '../value-objects/company-adress'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'

export interface CompanyEntityProps {
	id?: number
	uuid?: string
	name: string
	email: Email
	landline?: Landline
	phone?: Phone
	address: CompanyAdress
	city: string
	state: string
	zip?: ZipCode
	countryId: number
	taxId: TaxId
	description?: CompanyDescription
	businessArea: string
	personType?: PersonType
	status?: CompanyStatus
	createdAt?: Date
	updatedAt?: Date
}

export class CompanyEntity extends Entity<CompanyEntityProps> {
	public get uuid(): string | undefined {
		return this.props.uuid ?? this.id?.value
	}

	public get name(): string {
		return this.props.name
	}

	public get email(): string {
		return this.props.email.value
	}

	public get landline(): string | undefined {
		return this.props.landline?.value
	}

	public get phone(): string | undefined {
		return this.props.phone?.value
	}

	public get address(): string {
		return this.props.address.value
	}

	public get city(): string {
		return this.props.city
	}

	public get state(): string {
		return this.props.state
	}

	public get zip(): string | undefined {
		return this.props.zip?.value
	}

	public get countryId(): number {
		return this.props.countryId
	}

	public get taxId(): string {
		return this.props.taxId.value
	}

	public get description(): string | undefined {
		return this.props.description?.value
	}

	public get businessArea(): string {
		return this.props.businessArea
	}

	public get personType(): PersonType | undefined {
		return this.props.personType
	}

	public get createdAt(): Date {
		return this.props.createdAt ?? new Date()
	}

	public get updatedAt(): Date {
		return this.props.updatedAt ?? new Date()
	}

	public get status(): CompanyStatus | undefined {
		return this.props.status
	}

	public get active(): boolean {
		return this.props.status === CompanyStatus.ACTIVE
	}

	public get blocked(): boolean {
		return this.props.status === CompanyStatus.BLOCKED
	}

	public get onboarding(): boolean {
		return this.props.status === CompanyStatus.ONBOARDING
	}

	public get inactive(): boolean {
		return this.props.status === CompanyStatus.INACTIVE
	}

	public static create(
		props: CompanyEntityProps,
		id?: UniqueEntityId,
	): CompanyEntity {
		return new CompanyEntity(
			{
				...props,
				personType: props.personType ?? PersonType.INDIVIDUAL,
				status: props.status ?? CompanyStatus.ONBOARDING,
			},
			id ?? UniqueEntityId.create(),
		)
	}

	public static restore(props: CompanyEntityProps): CompanyEntity {
		return new CompanyEntity(props, UniqueEntityId.create(props.uuid))
	}
}
