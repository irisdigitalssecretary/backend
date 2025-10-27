import { UserRepository } from '../../domain/repositories/user-repository'
import { UserEntity } from '../../domain/entities/user-entity'
import { Either, left, right } from '@shared/domain/base/either'
import { UserEmailExistsError } from './errors/user-email-already-exists'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { AppError } from '@shared/domain/base/app-error'
import { InvalidPasswordError } from '../../../../shared/domain/errors/invalid-password-error'
import { InvalidEmailError } from '@/core/shared/domain/errors/invalid-email-error'
import { makeUserEntity } from '../../factories/make-user-entity'
import { Injectable } from '@nestjs/common'

interface CreateUserUseCaseRequest {
	name: string
	email: string
	password: string
	phone?: string
}

type CreateUserUseCaseResponse = Either<
	UserEmailExistsError | InvalidEmailError | InvalidPasswordError,
	UserEntity
>

@Injectable()
export class CreateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
	) {}

	public async execute(
		props: CreateUserUseCaseRequest,
	): Promise<CreateUserUseCaseResponse> {
		const userEmailAlreadyExists = await this.userRepository.findByEmail(
			props.email,
		)

		if (userEmailAlreadyExists) {
			return left(new UserEmailExistsError())
		}

		try {
			const user = await makeUserEntity(props, this.hasher)

			const result = await this.userRepository.create(user)
			return right(result)
		} catch (err) {
			return left(err as AppError)
		}
	}
}
