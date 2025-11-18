import { UserRepository } from '../../domain/repositories/user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserNotFoundError } from '../../../../shared/application/errors/user-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'
import { Injectable } from '@nestjs/common'

interface FindUserByUuidUseCaseRequest {
	uuid: string
}

type FindUserByUuidUseCaseResponse = Either<UserNotFoundError, UserEntity>

@Injectable()
export class FindUserByUuidUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		props: FindUserByUuidUseCaseRequest,
	): Promise<FindUserByUuidUseCaseResponse> {
		const user = await this.userRepository.findByUuid(props.uuid)

		if (!user) {
			return left(new UserNotFoundError())
		}

		return right(user)
	}
}
