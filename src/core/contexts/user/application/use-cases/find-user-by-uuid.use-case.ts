import { UserRepository } from '../../domain/repositories/user-repository'
import { UserEntity } from '../../domain/entities/user-entity'
import { UserNotFoundError } from './errors/user-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'

interface FindUserByIdUseCaseRequest {
	uuid: string
}

type FindUserByIdUseCaseResponse = Either<UserNotFoundError, UserEntity>

export class FindUserByIdUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		props: FindUserByIdUseCaseRequest,
	): Promise<FindUserByIdUseCaseResponse> {
		const user = await this.userRepository.findByUuid(props.uuid)

		if (!user) {
			return left(new UserNotFoundError())
		}

		return right(user)
	}
}
