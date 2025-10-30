import { UserRepository } from '../../domain/repositories/user-repository'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '../../domain/entities/user-entity'
import { Either, left, right } from '@shared/domain/base/either'
import { UserEmailExistsError } from './errors/user-email-already-exists'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { InvalidPasswordError } from '../../../../shared/domain/errors/invalid-password-error'
import { InvalidEmailError } from '@/core/shared/domain/errors/invalid-email-error'
import { UserNotFoundError } from './errors/user-not-found'
import { OldPasswordInvalidError } from '../../domain/errors/old-password-invalid'
import { OldPasswordRequiredError } from '../../domain/errors/old-password-required'
import { DomainError } from '@/core/shared/domain/base/domain-error'
import { Email } from '@/core/shared/domain/value-objects/email'

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

		try {
			userToUpdate.props = {
				...userToUpdate.props,
				email: Email.create(props.email),
				name: props.name,
				sessionStatus: props.sessionStatus,
				status: props.status,
			}

			if (props.password) {
				await userToUpdate.updatePassword({
					hasher: this.hasher,
					newPassword: props.password,
					oldPassword: props.oldPassword,
				})
			}

			const result = await this.userRepository.update(userToUpdate)
			return right(result)
		} catch (err) {
			return left(err as DomainError)
		}
	}
}
