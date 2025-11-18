import { UserRepository } from '../../domain/repositories/user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserNotFoundError } from '../../../../shared/application/errors/user-not-found'
import { Either, left, right } from '@/core/shared/domain/base/either'
import { Injectable } from '@nestjs/common'

interface DeleteUserByIdUseCaseRequest {
	id: number
}

type DeleteUserByIdUseCaseResponse = Either<UserNotFoundError, UserEntity>

@Injectable()
export class DeleteUserByIdUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	public async execute(
		props: DeleteUserByIdUseCaseRequest,
	): Promise<DeleteUserByIdUseCaseResponse> {
		const user = await this.userRepository.findById(props.id)

		if (!user) {
			return left(new UserNotFoundError())
		}

		await this.userRepository.delete(props.id)

		return right(user)
	}
}
