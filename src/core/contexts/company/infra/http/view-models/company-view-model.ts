import { CompanyEntity } from '../../../domain/entities/company.entity'

export class CompanyViewModel {
	static toHTTP(company: CompanyEntity) {
		return {
			id: company.id,
			uuid: company.uuid,
			name: company.name,
			email: company.email,
			landline: company.landline,
			phone: company.phone,
			taxId: company.taxId,
			address: company.address,
			zip: company.zip,
			city: company.city,
			description: company.description,
			businessArea: company.businessArea,
			personType: company.personType,
			status: company.status,
			createdAt: company.createdAt,
			updatedAt: company.updatedAt,
		}
	}
}
