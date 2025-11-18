import { UserRepository } from '../../domain/repositories/user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserNotFoundError } from '../../../../shared/application/errors/user-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { Injectable } from '@nestjs/common'

interface UpdateUserStatusUseCaseRequest {
	id: number
	status: UserStatus
}

type UpdateUserStatusUseCaseResponse = Either<UserNotFoundError, UserEntity>

@Injectable()
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
