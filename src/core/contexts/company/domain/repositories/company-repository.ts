import { FindManyOptions } from '@/core/shared/domain/utils/types/find-many'
import { CompanyEntity } from '../entities/company.entity'
import { OffsetPagination } from '@/core/shared/domain/value-objects/offset-pagination'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'

export interface CompanyFields {
	id: number
	uuid: string
	name: string
	email: string
	landline: string | null
	phone: string | null
	address: string
	city: string
	state: string
	zip: string | null
	countryId: number
	taxId: string
	description: string | null
	businessArea: string
	personType: PersonType
	createdAt: Date
	updatedAt: Date
}

export type CompanySelectableFields = keyof CompanyFields

export abstract class CompanyRepository {
	public abstract readonly companies: CompanyEntity[]
	abstract create(company: CompanyEntity): Promise<CompanyEntity>
	abstract findByEmail(email: string): Promise<CompanyEntity | null>
	abstract findByTaxId(taxId: string): Promise<CompanyEntity | null>
	abstract findById(id: number): Promise<CompanyEntity | null>
	abstract findByUuid(uuid: string): Promise<CompanyEntity | null>
	abstract update(company: CompanyEntity): Promise<CompanyEntity>
	abstract delete(id: number): Promise<void>
	abstract updateStatus(
		id: number,
		status: CompanyStatus,
	): Promise<CompanyEntity>
	abstract findManyByOffsetPagination(
		props: FindManyOptions<
			Partial<CompanyFields>,
			OffsetPagination,
			CompanySelectableFields
		>,
	): Promise<CompanyEntity[]>
}
