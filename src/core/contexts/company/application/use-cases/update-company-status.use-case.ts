import { Injectable } from '@nestjs/common'
import { CompanyRepository } from '../../domain/repositories/company.repository'
import { CompanyEntity } from '../../domain/entities/company.entity'
import { CompanyNotFoundError } from '@/core/shared/application/errors/company-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'

interface UpdateCompanyStatusUseCaseRequest {
	id: number
	status: CompanyStatus
}

type UpdateCompanyStatusUseCaseResponse = Either<
	CompanyNotFoundError,
	CompanyEntity
>

@Injectable()
export class UpdateCompanyStatusUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	public async execute(
		props: UpdateCompanyStatusUseCaseRequest,
	): Promise<UpdateCompanyStatusUseCaseResponse> {
		const company = await this.companyRepository.findById(props.id)

		if (!company) {
			return left(new CompanyNotFoundError())
		}

		await this.companyRepository.updateStatus(props.id, props.status)

		return right(company)
	}
}

