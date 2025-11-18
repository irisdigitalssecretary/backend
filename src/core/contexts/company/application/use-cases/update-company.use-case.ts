import { Injectable } from '@nestjs/common'
import { CompanyRepository } from '../../domain/repositories/company.repository'
import { CompanyEntity } from '../../domain/entities/company.entity'
import { CompanyTaxIdAlreadyExistsError } from '../errors/company-tax-id-already-exists'
import { Either, left, right } from '@/core/shared/domain/base/either'
import { CompanyFactory } from '../../domain/factories/make-company-entity'
import { ZipCodeValidator } from '@/core/shared/domain/infra/services/validators/zip-code-validator'
import { TaxIdValidator } from '@/core/shared/domain/infra/services/validators/tax-id-validator'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { CompanyEmailAlreadyExistsError } from '../errors/company-email-already-exists'
import { DomainError } from '@/core/shared/domain/base/domain-error'
import { CountryRepository } from '@/core/contexts/country/domain/repositories/country.repository'
import { CountryNotFoundError } from '@/core/shared/application/errors/country-not-found'
import { TooShortCompanyDescriptionError } from '../../domain/errors/too-short-company-description'
import { TooLongCompanyDescriptionError } from '../../domain/errors/too-long-company-description'
import { ZipCodeInvalidError } from '@/core/shared/domain/errors/zip-code-invalid-error'
import { TaxIdInvalidError } from '@/core/shared/domain/errors/tax-id-invalid-error'
import { TooShortCompanyAdressError } from '../../domain/errors/too-short-company-address'
import { TooLongCompanyAdressError } from '../../domain/errors/too-long-company-address'
import { InvalidPhoneError } from '@/core/shared/domain/errors/invalid-phone-error'
import { InvalidLandlineError } from '@/core/shared/domain/errors/invalid-landline-error'
import { InvalidEmailError } from '@/core/shared/domain/errors/invalid-email-error'
import { CompanyNotFoundError } from '@/core/shared/application/errors/company-not-found'

interface UpdateCompanyUseCaseRequest {
	name: string
	email: string
	landline?: string
	phone?: string
	taxId: string
	address: string
	zip?: string
	city: string
	state: string
	description?: string
	businessArea: string
	personType: PersonType
	status?: CompanyStatus
	countryCode: string
}

type UpdateCompanyUseCaseResponse = Either<
	| CompanyTaxIdAlreadyExistsError
	| CountryNotFoundError
	| CompanyEmailAlreadyExistsError
	| TooShortCompanyDescriptionError
	| TooLongCompanyDescriptionError
	| DomainError
	| ZipCodeInvalidError
	| TooShortCompanyAdressError
	| TooLongCompanyAdressError
	| InvalidPhoneError
	| InvalidLandlineError
	| TaxIdInvalidError
	| InvalidEmailError
	| CompanyNotFoundError,
	CompanyEntity
>

@Injectable()
export class UpdateCompanyUseCase {
	constructor(
		private readonly companyRepository: CompanyRepository,
		private readonly countryRepository: CountryRepository,
		private readonly taxIdValidator: TaxIdValidator,
		private readonly zipCodeValidator: ZipCodeValidator,
	) {}

	public async execute(
		props: UpdateCompanyUseCaseRequest,
		id: number,
	): Promise<UpdateCompanyUseCaseResponse> {
		const companyToUpdate = await this.companyRepository.findById(id)

		if (!companyToUpdate) {
			return left(new CompanyNotFoundError())
		}

		const companyEmailAlreadyExists =
			await this.companyRepository.findByEmail(props.email)

		if (
			companyEmailAlreadyExists &&
			companyEmailAlreadyExists.id !== companyToUpdate.id
		) {
			return left(new CompanyEmailAlreadyExistsError())
		}

		const companyTaxIdAlreadyExists =
			await this.companyRepository.findByTaxId(props.taxId)

		if (
			companyTaxIdAlreadyExists &&
			companyTaxIdAlreadyExists.id !== companyToUpdate.id
		) {
			return left(new CompanyTaxIdAlreadyExistsError())
		}

		const countryFromCode = await this.countryRepository.findByCode(
			props.countryCode,
		)

		if (!countryFromCode) {
			return left(new CountryNotFoundError())
		}

		try {
			const company = CompanyFactory.create(
				{
					...props,
					countryId: Number(countryFromCode.id?.value),
				},
				{
					taxIdValidator: this.taxIdValidator,
					zipCodeValidator: this.zipCodeValidator,
					countryCode: countryFromCode.iso2,
				},
			)

			companyToUpdate.props = {
				...companyToUpdate.props,
				...company.props,
			}

			const result = await this.companyRepository.update(companyToUpdate)
			return right(result)
		} catch (error) {
			return left(error as DomainError)
		}
	}
}
