import {
	CompanyFields,
	CompanyRepository,
	CompanySelectableFields,
} from '../../../domain/repositories/company.repository'
import { CompanyEntity } from '../../../domain/entities/company.entity'
import { CompanyMapper } from '../mappers/company.mapper'
import { FindManyOptions } from '@/core/shared/domain/utils/types/find-many'
import { OffsetPagination } from '@/core/shared/domain/value-objects/offset-pagination'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
	public companies: CompanyEntity[] = []

	constructor(private readonly prisma: PrismaService) {}

	async updateStatus(
		id: number,
		status: CompanyStatus,
	): Promise<CompanyEntity> {
		const prisma = this.prisma

		const updatedCompany = await prisma.company.update({
			where: { id },
			data: { status },
		})
		return CompanyMapper.toDomain(updatedCompany)
	}

	async create(company: CompanyEntity): Promise<CompanyEntity> {
		const prisma = this.prisma

		const createdCompany = await prisma.company.create({
			data: CompanyMapper.toPersistence(company),
		})

		return CompanyMapper.toDomain(createdCompany)
	}

	async findByEmail(email: string): Promise<CompanyEntity | null> {
		const company = await this.prisma.company.findFirst({
			where: { email },
		})
		return company ? CompanyMapper.toDomain(company) : null
	}

	async findByEmailOrTaxId(
		email: string,
		taxId: string,
	): Promise<CompanyEntity | null> {
		const company = await this.prisma.company.findFirst({
			where: { OR: [{ email }, { taxId }] },
		})

		return company ? CompanyMapper.toDomain(company) : null
	}

	async findByTaxId(taxId: string): Promise<CompanyEntity | null> {
		const company = await this.prisma.company.findFirst({
			where: { taxId },
		})
		return company ? CompanyMapper.toDomain(company) : null
	}

	async findById(id: number): Promise<CompanyEntity | null> {
		const company = await this.prisma.company.findUnique({
			where: { id },
		})

		return company ? CompanyMapper.toDomain(company) : null
	}

	async findByUuid(uuid: string): Promise<CompanyEntity | null> {
		const company = await this.prisma.company.findUnique({
			where: { uuid },
		})
		return company ? CompanyMapper.toDomain(company) : null
	}

	async update(company: CompanyEntity): Promise<CompanyEntity> {
		const prisma = this.prisma

		const updatedCompany = await prisma.company.update({
			where: { id: company.props.id },
			data: CompanyMapper.toPersistence(company),
		})

		return CompanyMapper.toDomain(updatedCompany)
	}

	async delete(id: number): Promise<void> {
		await this.prisma.company.delete({
			where: { id },
		})
	}

	async findManyByOffsetPagination(
		props: FindManyOptions<
			Partial<CompanyFields>,
			OffsetPagination,
			CompanySelectableFields
		>,
	): Promise<CompanyEntity[]> {
		const prisma = this.prisma
		const { filters } = props
		const whereClause: Prisma.CompanyWhereInput = {}

		if (filters?.name) {
			whereClause.name = {
				contains: filters.name,
				mode: 'insensitive',
			}
		}

		if (filters?.email) {
			whereClause.email = {
				contains: filters.email,
				mode: 'insensitive',
			}
		}

		if (filters?.taxId) {
			whereClause.taxId = {
				contains: filters.taxId,
				mode: 'insensitive',
			}
		}

		if (filters?.city) {
			whereClause.city = {
				contains: filters.city,
				mode: 'insensitive',
			}
		}

		if (filters?.state) {
			whereClause.state = {
				contains: filters.state,
				mode: 'insensitive',
			}
		}

		if (filters?.businessArea) {
			whereClause.businessArea = {
				contains: filters.businessArea,
				mode: 'insensitive',
			}
		}

		if (filters?.personType) {
			whereClause.personType = filters.personType
		}

		if (filters?.countryId) {
			whereClause.countryId = filters.countryId
		}

		const companies = await prisma.company.findMany({
			where: whereClause,
			skip: props.pagination?.after,
			take: props.pagination?.limit,
			orderBy: props.orderBy,
			select: this.prisma.buildSelectObject<CompanySelectableFields>(
				props.select,
			),
		})

		const domainCompanies: CompanyEntity[] = await Promise.all(
			companies.map((c) => CompanyMapper.toDomain(c)),
		)

		return domainCompanies
	}
}
