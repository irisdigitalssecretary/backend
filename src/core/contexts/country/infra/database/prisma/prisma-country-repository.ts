import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'
import { CountryEntity } from '../../../domain/entities/country.entity'
import { CountryRepository } from '../../../domain/repositories/country.repository'
import { CountryMapper } from '../mappers/country.mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaCountryRepository implements CountryRepository {
	public readonly countries: CountryEntity[] = []

	constructor(private readonly prisma: PrismaService) {}

	async findByCode(code: string): Promise<CountryEntity | null> {
		const country = await this.prisma.country.findFirst({
			where: { OR: [{ iso2: code }, { iso3: code }, { locale: code }] },
		})

		return country ? CountryMapper.toDomain(country) : null
	}
}
