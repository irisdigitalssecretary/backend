import {
	CompanyRepository,
	CompanyFields,
	CompanySelectableFields,
} from '../../domain/repositories/company.repository'
import { CompanyEntity } from '../../domain/entities/company.entity'
import { Either, right } from '@/core/shared/domain/base/either'
import { FindManyOptions } from '@/core/shared/domain/utils/types/find-many'
import { OffsetPagination } from '@/core/shared/domain/value-objects/offset-pagination'
import { Injectable } from '@nestjs/common'
import { Pagination } from '@/core/shared/application/utils/pagination'

type FindManyCompaniesByOffsetPaginationUseCaseRequest = FindManyOptions<
	Partial<CompanyFields>,
	Pagination,
	CompanySelectableFields
>

type FindManyCompaniesByOffsetPaginationUseCaseResponse = Either<
	null,
	CompanyEntity[]
>

@Injectable()
export class FindManyCompaniesByOffsetPaginationUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	public async execute(
		props: FindManyCompaniesByOffsetPaginationUseCaseRequest,
	): Promise<FindManyCompaniesByOffsetPaginationUseCaseResponse> {
		return right(
			await this.companyRepository.findManyByOffsetPagination({
				filters: props.filters,
				pagination: OffsetPagination.create(
					props?.pagination?.limit,
					props?.pagination?.page,
				),
				orderBy: props.orderBy,
				select: props.select,
			}),
		)
	}
}
