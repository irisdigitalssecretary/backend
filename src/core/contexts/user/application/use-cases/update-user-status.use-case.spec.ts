import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import { UserNotFoundError } from '../../../../shared/application/errors/user-not-found'
import { UserFactory } from '../../factories/make-user-entity'
import { UpdateUserStatusUseCase } from './update-user-status.use-case'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'

describe('UpdateUserStatusUseCase', () => {
	let hasher: Hasher
	let userRepository: UserRepository
	let updateUserStatusUseCase: UpdateUserStatusUseCase

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	beforeEach(() => {
		userRepository = new InMemoryUserRepository()
		updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository)
	})

	it('should not be able to update the user status if the user does not exist', async () => {
		const result = await updateUserStatusUseCase.execute({
			id: 999,
			status: UserStatus.INACTIVE,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UserNotFoundError)
		expect(result.value).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
		expect(
			userRepository.users.find((user) => user.props.id === 999),
		).toBeUndefined()
	})

	it('should be able to update the user status by id', async () => {
		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
				},
				hasher,
			),
		)

		expect(userRepository.users.length).toBe(1)

		const result = await updateUserStatusUseCase.execute({
			id: user.props.id as number,
			status: UserStatus.INACTIVE,
		})

		expect(result.isRight()).toBe(true)
		expect(userRepository.users.length).toBe(1)
		expect(userRepository.users[0].props.id).toBe(user.props.id)
		expect(userRepository.users[0].status).toBe(UserStatus.INACTIVE)
	})
})
