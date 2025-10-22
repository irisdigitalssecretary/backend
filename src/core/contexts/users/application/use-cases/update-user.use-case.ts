import { UserRepository } from '../../domain/repositories/user-repository'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '../../domain/entities/user-entity'
import { Either, left, right } from '@shared/domain/base/either'
import { UserEmailExistsError } from '../../domain/errors/user-email-already-exists'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { AppError } from '@shared/domain/base/app-error'
import { InvalidPasswordError } from '../../../../shared/domain/errors/invalid-password'
import { InvalidEmailError } from '@shared/domain/errors/invalid-email'
import { makeUserEntity } from '../../factories/make-user-entity'
import { UserNotFoundError } from '../../domain/errors/user-not-found'
import { OldPasswordRequiredError } from '../../domain/errors/old-password-required'
import { OldPasswordInvalidError } from '../../domain/errors/old-password-invalid'

interface UpdateUserUseCaseRequest {
	name: string
	email: string
	password?: string
	oldPassword?: string
	sessionStatus: SessionStatus
	status: UserStatus
}

type UpdateUserUseCaseResponse = Either<
	| UserEmailExistsError
	| InvalidEmailError
	| InvalidPasswordError
	| UserNotFoundError
	| OldPasswordRequiredError
	| OldPasswordInvalidError,
	UserEntity
>

export class UpdateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
	) {}

	public async execute(
		props: UpdateUserUseCaseRequest,
		id: number,
	): Promise<UpdateUserUseCaseResponse> {
		let userEmailAlreadyExists: UserEntity | null = null

		const userToUpdate = await this.userRepository.findById(id)

		if (!userToUpdate) {
			return left(new UserNotFoundError())
		}

		if (props.email) {
			userEmailAlreadyExists = await this.userRepository.findByEmail(
				props.email,
			)
		}

		if (userEmailAlreadyExists && userEmailAlreadyExists.props.id !== id) {
			return left(new UserEmailExistsError())
		}

		if (props.password && !props.oldPassword) {
			return left(new OldPasswordRequiredError())
		}

		let isOldPasswordValid = false

		if (props.password && props.oldPassword) {
			isOldPasswordValid = await this.hasher.compare(
				props.oldPassword,
				userToUpdate.password ?? '',
			)
		}

		if (!isOldPasswordValid) {
			return left(new OldPasswordInvalidError())
		}

		try {
			const userEntity = await makeUserEntity(
				{
					id: userToUpdate.props.id,
					...props,
				},
				this.hasher,
			)

			const result = await this.userRepository.update(userEntity)
			return right(result)
		} catch (err) {
			return left(err as AppError)
		}
	}
}
