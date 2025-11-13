import { UserRepository } from '../../domain/repositories/user-repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { Either, left, right } from '@shared/domain/base/either'
import { UserEmailExistsError } from './errors/user-email-already-exists'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'
import { InvalidPasswordError } from '../../../../shared/domain/errors/invalid-password-error'
import { InvalidEmailError } from '@/core/shared/domain/errors/invalid-email-error'
import { UserFactory } from '../../factories/make-user-entity'
import { Injectable } from '@nestjs/common'
import { DomainError } from '@/core/shared/domain/base/domain-error'

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
			const user = await UserFactory.create(props, this.hasher)

			const result = await this.userRepository.create(user)
			return right(result)
		} catch (err) {
			return left(err as DomainError)
		}
	}
}
