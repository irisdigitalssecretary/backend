import { UserRepository } from '../../domain/repositories/user-repository'
import { SessionStatus, UserEntity } from '../../domain/entities/user-entity'
import { UserNotFoundError } from '../../../../shared/application/errors/user-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'

interface UpdateUserSessionStatusUseCaseRequest {
	id: number
	status: SessionStatus
}

type UpdateUserSessionStatusUseCaseResponse = Either<
	UserNotFoundError,
	UserEntity
>

export class UpdateUserSessionStatusUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		props: UpdateUserSessionStatusUseCaseRequest,
	): Promise<UpdateUserSessionStatusUseCaseResponse> {
		const user = await this.userRepository.findById(props.id)

		if (!user) {
			return left(new UserNotFoundError())
		}

		await this.userRepository.updateSessionStatus(props.id, props.status)

		return right(user)
	}
}
