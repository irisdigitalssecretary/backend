import { UserRepository } from '../../domain/repositories/user-repository'
import { UserEntity, UserStatus } from '../../domain/entities/user-entity'
import { UserNotFoundError } from '../../domain/errors/user-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'

interface UpdateUserStatusUseCaseRequest {
	id: string
	status: UserStatus
}

type UpdateUserStatusUseCaseResponse = Either<UserNotFoundError, UserEntity>

export class UpdateUserStatusUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		props: UpdateUserStatusUseCaseRequest,
	): Promise<UpdateUserStatusUseCaseResponse> {
		const user = await this.userRepository.findById(props.id)

		if (!user) {
			return left(new UserNotFoundError())
		}

		await this.userRepository.updateStatus(props.id, props.status)

		return right(user)
	}
}
