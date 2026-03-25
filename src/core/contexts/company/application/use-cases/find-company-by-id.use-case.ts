import { CompanyRepository } from '../../domain/repositories/company.repository'
import { CompanyEntity } from '../../domain/entities/company.entity'
import { CompanyNotFoundError } from '../../../../shared/application/errors/company-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'
import { Injectable } from '@nestjs/common'

interface FindCompanyByIdUseCaseRequest {
	id: number
}

type FindCompanyByIdUseCaseResponse = Either<
	CompanyNotFoundError,
	CompanyEntity
>

@Injectable()
export class FindCompanyByIdUseCase {
	constructor(private readonly companyRepository: CompanyRepository) { }

	public async execute(
		props: FindCompanyByIdUseCaseRequest,
	): Promise<FindCompanyByIdUseCaseResponse> {
		const company = await this.companyRepository.findById(props.id)

		if (!company) {
			return left(new CompanyNotFoundError())
		}

		return right(company)
	}
}
