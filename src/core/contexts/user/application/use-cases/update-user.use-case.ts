import { UserEntity } from '../../domain/entities/user.entity'
import { Either, left, right } from '@shared/domain/base/either'
import { UserEmailExistsError } from '../errors/user-email-already-exists'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'
import { InvalidPasswordError } from '../../../../shared/domain/errors/invalid-password-error'
import { InvalidEmailError } from '@/core/shared/domain/errors/invalid-email-error'
import { UserNotFoundError } from '../../../../shared/application/errors/user-not-found'
import { OldPasswordInvalidError } from '../../domain/errors/old-password-invalid'
import { OldPasswordRequiredError } from '../../domain/errors/old-password-required'
import { DomainError } from '@/core/shared/domain/base/domain-error'
import { Email } from '@/core/shared/domain/value-objects/email'
import { Phone } from '@/core/shared/domain/value-objects/phone'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../domain/repositories/user.repository'

interface UpdateUserUseCaseRequest {
	name: string
	email: string
	password?: string
	oldPassword?: string
	phone?: string
	companyId: number
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
@Injectable()
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
				userToUpdate.props.companyId,
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
				phone: props?.phone ? Phone.create(props.phone) : undefined,
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
