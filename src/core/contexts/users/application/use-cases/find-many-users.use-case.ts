import { UserRepository } from '../../domain/repositories/user-repository'
import { UserEntity } from '../../domain/entities/user-entity'
import { UserNotFoundError } from '../../domain/errors/user-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'

interface FindManyUsersUseCaseRequest {
	uuid: string
}

type FindManyUsersUseCaseResponse = Either<UserNotFoundError, UserEntity>

export class FindManyUsersUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		props: FindManyUsersUseCaseRequest,
	): Promise<FindManyUsersUseCaseResponse> {
		cons
}
