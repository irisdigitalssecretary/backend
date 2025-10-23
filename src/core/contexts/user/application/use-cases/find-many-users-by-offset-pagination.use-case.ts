import {
	UserFilters,
	UserRepository,
} from '../../domain/repositories/user-repository'
import { UserEntity } from '../../domain/entities/user-entity'
import { Either, right } from '@/core/shared/domain/base/either'
import { FindManyOptions } from '@/core/shared/domain/utils/find-many'
import { OffsetPagination } from '@/core/shared/domain/utils/offset-pagination'

type FindManyUsersByOffsetPaginationUseCaseRequest = FindManyOptions<
	UserFilters,
	OffsetPagination
>

type FindManyUsersByOffsetPaginationUseCaseResponse = Either<null, UserEntity[]>

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
			}),
		)
	}
}
