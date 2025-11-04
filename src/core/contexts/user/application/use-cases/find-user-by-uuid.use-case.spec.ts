import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserNotFoundError } from '../../../../shared/application/errors/user-not-found'
import { makeUserEntity } from '../../factories/make-user-entity'
import { FindUserByIdUseCase } from './find-user-by-uuid.use-case'

describe('FindUserByIdUseCase', () => {
	let hasher: Hasher
	let userRepository: UserRepository
	let findUserByIdUseCase: FindUserByIdUseCase

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	beforeEach(() => {
		userRepository = new InMemoryUserRepository()
		findUserByIdUseCase = new FindUserByIdUseCase(userRepository)
	})

	it('should not be able to find a user if it does not exist', async () => {
		const result = await findUserByIdUseCase.execute({
			uuid: 'non-existent-uuid',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UserNotFoundError)
		expect(result.value).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
		expect(userRepository.users.length).toBe(0)
	})

	it('should be able to find a user by uuid', async () => {
		const uuid = '123e4567-e89b-12d3-a456-426614174000'

		await userRepository.create(
			await makeUserEntity(
				{
					uuid,
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
				},
				hasher,
			),
		)

		expect(userRepository.users.length).toBe(1)

		const result = await findUserByIdUseCase.execute({ uuid })

		expect(result.isRight()).toBe(true)

		if (!result.isRight()) {
			throw result.value
		}

		const user = result.value
		expect(user).toBeInstanceOf(UserEntity)
		expect(user).toMatchObject({
			uuid,
			email: 'john.doe@example.com',
			name: 'John Doe',
		})
	})
})
