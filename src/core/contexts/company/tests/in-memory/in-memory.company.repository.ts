import { OffsetPagination } from '@/core/shared/domain/value-objects/offset-pagination'
import { CompanyEntity } from '../../domain/entities/company.entity'
import {
	CompanyFields,
	CompanyRepository,
	CompanySelectableFields,
} from '../../domain/repositories/company.repository'
import { FindManyOptions } from '@/core/shared/domain/utils/types/find-many'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'
import { CompanyFactory } from '../../domain/factories/make-company-entity'
import { resolveInMemoryOrdering } from '@/core/shared/tests/unit/utils/helpers/resolve-in-memory-ordering'

export class InMemoryCompanyRepository implements CompanyRepository {
	public readonly companies: CompanyEntity[] = []

	public create(company: CompanyEntity): Promise<CompanyEntity> {
		return new Promise((resolve) => {
			company.props.id =
				company.props.id || Math.floor(Math.random() * 100)
			this.companies.push(company)
			resolve(company)
		})
	}

	public findByEmail(email: string): Promise<CompanyEntity | null> {
		return new Promise((resolve) => {
			const company = this.companies.find(
				(company) => company.email === email,
			)
			resolve(company ?? null)
		})
	}

	public findByTaxId(taxId: string): Promise<CompanyEntity | null> {
		return new Promise((resolve) => {
			const company = this.companies.find(
				(company) => company.taxId === taxId,
			)
			resolve(company ?? null)
		})
	}

	public findByEmailOrTaxId(
		email: string,
		taxId: string,
	): Promise<CompanyEntity | null> {
		return new Promise((resolve) => {
			const company = this.companies.find(
				(company) => company.email === email || company.taxId === taxId,
			)
			resolve(company ?? null)
		})
	}

	public findById(id: number): Promise<CompanyEntity | null> {
		return new Promise((resolve) => {
			const company = this.companies.find(
				(company) => company.props.id === id,
			)
			resolve(company ?? null)
		})
	}

	public findByUuid(uuid: string): Promise<CompanyEntity | null> {
		return new Promise((resolve) => {
			const company = this.companies.find(
				(company) => company.uuid === uuid,
			)
			resolve(company ?? null)
		})
	}

	public update(companyToUpdate: CompanyEntity): Promise<CompanyEntity> {
		return new Promise((resolve) => {
			const index = this.companies.findIndex(
				(company) => companyToUpdate.props.id === company.props.id,
			)

			this.companies[index] = companyToUpdate

			resolve(this.companies[index])
		})
	}

	public delete(id: number): Promise<void> {
		return new Promise((resolve) => {
			const index = this.companies.findIndex(
				(company) => company.props.id === id,
			)
			this.companies.splice(index, 1)
			resolve()
		})
	}

	public updateStatus(
		id: number,
		status: CompanyStatus,
	): Promise<CompanyEntity> {
		return new Promise((resolve) => {
			const index = this.companies.findIndex(
				(company) => company.props.id === id,
			)
			this.companies[index].props.status = status
			resolve(this.companies[index])
		})
	}

	public findManyByOffsetPagination(
		props: FindManyOptions<
			Partial<CompanyFields>,
			OffsetPagination,
			CompanySelectableFields
		>,
	): Promise<CompanyEntity[]> {
		return new Promise((resolve) => {
			const { filters, select, orderBy } = props

			let companies = this.companies.filter((company) => {
				let condition = true

				if (filters?.name) {
					condition = !!(
						condition &&
						company.name
							.toLowerCase()
							.includes(filters.name.toLowerCase())
					)
				}
				if (filters?.email) {
					condition = !!(
						condition &&
						company.email
							.toLowerCase()
							.includes(filters.email.toLowerCase())
					)
				}
				if (filters?.taxId) {
					condition = !!(
						condition &&
						company.taxId
							.toLowerCase()
							.includes(filters.taxId.toLowerCase())
					)
				}
				if (filters?.phone) {
					condition = !!(
						condition &&
						company.phone
							?.toLowerCase()
							.includes(filters.phone.toLowerCase())
					)
				}
				if (filters?.city) {
					condition = !!(
						condition &&
						company.city
							.toLowerCase()
							.includes(filters.city.toLowerCase())
					)
				}
				if (filters?.state) {
					condition = !!(
						condition &&
						company.state
							.toLowerCase()
							.includes(filters.state.toLowerCase())
					)
				}
				if (filters?.businessArea) {
					condition = !!(
						condition &&
						company.businessArea
							.toLowerCase()
							.includes(filters.businessArea.toLowerCase())
					)
				}
				if (filters?.personType) {
					condition = !!(
						condition && company.personType === filters.personType
					)
				}

				return condition
			})

			companies = resolveInMemoryOrdering(companies, orderBy)

			companies = companies.slice(
				props.pagination?.after,
				(props.pagination?.after || 0) +
					(props.pagination?.limit || 15),
			)

			if (select && select.length > 0) {
				companies = companies.map((company) => {
					const selectedFields: any = {}
					select.forEach((field) => {
						if (field in company || field in company.props) {
							selectedFields[field] =
								company[field] || company.props[field]
						}
					})

					return CompanyFactory.reconstitute({
						id: company.id,
						...selectedFields,
						email: company.props.email,
						address: company.props.address,
						city: company.props.city,
						state: company.props.state,
						countryId: company.props.countryId,
						taxId: company.props.taxId,
						businessArea: company.props.businessArea,
					})
				})
			}

			resolve(companies)
		})
	}
}
