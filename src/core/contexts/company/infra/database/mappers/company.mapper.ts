import { CompanyFactory } from '../../../domain/factories/make-company-entity'
import { CompanyEntity } from '../../../domain/entities/company.entity'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'
import { Company } from '@prisma/client'

export class CompanyMapper {
	static toDomain(company: Company): CompanyEntity {
		return CompanyFactory.reconstitute({
			uuid: company.uuid,
			id: company.id,
			name: company.name,
			email: company.email,
			landline: company.landline ?? undefined,
			address: company.address,
			city: company.city,
			state: company.state,
			zip: company.zip ?? undefined,
			countryId: company.countryId,
			taxId: company.taxId,
			description: company.description ?? undefined,
			businessArea: company.businessArea,
			personType:
				PersonType[company.personType?.toUpperCase()] ?? undefined,
			status: CompanyStatus[company.status?.toUpperCase()] ?? undefined,
			createdAt: company.createdAt,
			updatedAt: company.updatedAt,
			phone: company.phone ?? undefined,
		})
	}

	static toPersistence(company: CompanyEntity) {
		return {
			name: company.name,
			email: company.email,
			landline: company.landline,
			address: company.address,
			city: company.city,
			state: company.state,
			zip: company.zip,
			countryId: company.countryId,
			taxId: company.taxId,
			description: company.description,
			businessArea: company.businessArea,
			personType: company.personType,
			status: company.status,
			phone: company.phone,
		}
	}
}
