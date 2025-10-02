import { Hasher } from '@shared/infra/services/hasher'
import { UserRepository } from '../domain/repositories/user-repository'
import { UserEntity } from '../domain/entities/user-entity'
import { Either } from '@/core/shared/domain/base/either'

interface CreateUserUseCaseRequest {
	name: string
	email: string
	password: string
}

type CreateUserUseCaseResponse = Either<string, UserEntity>

export class CreateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
	) {}

	public async execute(
		props: CreateUserUseCaseRequest,
	): Promise<CreateUserUseCaseResponse> {}
}