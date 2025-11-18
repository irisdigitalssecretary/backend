import { CountryEntity } from '../entities/country.entity'

export abstract class CountryRepository {
	abstract findByCode(code: string): Promise<CountryEntity | null>
}
