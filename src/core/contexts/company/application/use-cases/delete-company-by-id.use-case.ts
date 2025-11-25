import { Injectable } from '@nestjs/common'
import { CompanyRepository } from '../../domain/repositories/company.repository'
import { Either, left, right } from '@/core/shared/domain/base/either'
import { CompanyNotFoundError } from '@/core/shared/application/errors/company-not-found'

type DeleteCompanyUseCaseResponse = Either<CompanyNotFoundError, null>

@Injectable()
export class DeleteCompanyByIdUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	public async execute(id: number): Promise<DeleteCompanyUseCaseResponse> {
		const company = await this.companyRepository.findById(id)

		if (!company) {
			return left(new CompanyNotFoundError())
		}

		await this.companyRepository.delete(id)

		return right(null)
	}
}
