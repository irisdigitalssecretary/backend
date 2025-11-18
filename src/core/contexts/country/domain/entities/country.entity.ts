import { Entity } from '@/core/shared/domain/base/entity'
import { UniqueEntityId } from '@/core/shared/domain/value-objects/unique-entity-id'

export interface CountryProps {
	id?: number
	name: string
	iso2: string
	iso3: string
	phoneCode: string | null
	locale: string | null
	createdAt?: Date
}

export class CountryEntity extends Entity<CountryProps> {
	public static create(
		props: CountryProps,
		id?: UniqueEntityId,
	): CountryEntity {
		return new CountryEntity(props, id ?? UniqueEntityId.create())
	}

	public get name(): string {
		return this.props.name
	}

	public get iso2(): string {
		return this.props.iso2
	}

	public get iso3(): string {
		return this.props.iso3
	}

	public get phoneCode(): string | null {
		return this.props.phoneCode
	}

	public get locale(): string | null {
		return this.props.locale
	}

	public get createdAt(): Date | undefined {
		return this.props.createdAt
	}

	public static restore(props: CountryProps): CountryEntity {
		return new CountryEntity(props, UniqueEntityId.create(String(props.id)))
	}
}
