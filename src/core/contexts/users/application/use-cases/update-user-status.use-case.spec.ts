import { BcryptHasher } from '@shared/infra/services/bcrypt-hasher'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import { UserNotFoundError } from '../../domain/errors/user-not-found'
import { makeUserEntity } from '../../factories/make-user-entity'
import { UpdateUserStatusUseCase } from './update-user-status.use-case'
import { UserStatus } from '../../domain/entities/user-entity'

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
			id: '999',
			status: UserStatus.INACTIVE,
		})

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof UserNotFoundError &&
				result.value.statusCode === 404,
		).toBe(true)
		expect(
			userRepository.users.find((user) => user.props.id === '999'),
		).toBeUndefined()
	})

	it('should be able to update the user status by id', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
			id: user.props.id as string,
			status: UserStatus.INACTIVE,
		})

		expect(result.isRight()).toBe(true)
		expect(userRepository.users.length).toBe(1)
		expect(userRepository.users[0].props.id).toBe(user.props.id)
		expect(userRepository.users[0].status).toBe(UserStatus.INACTIVE)
	})
})
