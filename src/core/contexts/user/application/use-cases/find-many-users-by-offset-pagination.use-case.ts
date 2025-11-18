import {
	UserFields,
	UserRepository,
	UserSelectableFields,
} from '../../domain/repositories/user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { Either, right } from '@/core/shared/domain/base/either'
import { FindManyOptions } from '@/core/shared/domain/utils/types/find-many'
import { OffsetPagination } from '@/core/shared/domain/value-objects/offset-pagination'
import { Injectable } from '@nestjs/common'
import { Pagination } from '@/core/shared/application/utils/pagination'

type FindManyUsersByOffsetPaginationUseCaseRequest = FindManyOptions<
	Partial<UserFields>,
	Pagination,
	UserSelectableFields
>

type FindManyUsersByOffsetPaginationUseCaseResponse = Either<null, UserEntity[]>

@Injectable()
export class FindManyUsersByOffsetPaginationUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		props: FindManyUsersByOffsetPaginationUseCaseRequest,
	): Promise<FindManyUsersByOffsetPaginationUseCaseResponse> {
		return right(
			await this.userRepository.findManyByOffsetPagination({
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
