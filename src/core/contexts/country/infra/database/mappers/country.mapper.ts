import { Country } from '@prisma/client'
import { CountryEntity } from '../../../domain/entities/country.entity'
import { CountryFactory } from '../../../domain/factories/make-country-entity'

export class CountryMapper {
	public static toDomain(country: Country): CountryEntity {
		return CountryFactory.reconstitute({
			id: country.id,
			name: country.name,
			iso2: country.iso2,
			iso3: country.iso3,
			phoneCode: country.phoneCode,
			locale: country.locale,
		})
	}
}
