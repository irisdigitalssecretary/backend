import { CountryEntity } from '../entities/country.entity'

interface CountryProps {
	id?: number
	name: string
	iso2: string
	iso3: string
	phoneCode: string | null
	locale: string | null
	createdAt?: Date
}

export class CountryFactory {
	public static create(props: CountryProps): CountryEntity {
		return CountryEntity.create(props)
	}

	public static reconstitute(props: CountryProps): CountryEntity {
		return CountryEntity.restore(props)
	}
}
