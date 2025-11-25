import { CompanyRepository } from '../../domain/repositories/company.repository'
import { CompanyEntity } from '../../domain/entities/company.entity'
import { CompanyNotFoundError } from '../../../../shared/application/errors/company-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'
import { Injectable } from '@nestjs/common'

interface FindCompanyByUuidUseCaseRequest {
	uuid: string
}

type FindCompanyByUuidUseCaseResponse = Either<
	CompanyNotFoundError,
	CompanyEntity
>

@Injectable()
export class FindCompanyByUuidUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	public async execute(
		props: FindCompanyByUuidUseCaseRequest,
	): Promise<FindCompanyByUuidUseCaseResponse> {
		const company = await this.companyRepository.findByUuid(props.uuid)

		if (!company) {
			return left(new CompanyNotFoundError())
		}

		return right(company)
	}
}
