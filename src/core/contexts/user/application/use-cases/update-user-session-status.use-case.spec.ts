import { BcryptHasher } from '@shared/infra/services/bcrypt-hasher'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import { UserNotFoundError } from '../../domain/errors/user-not-found'
import { makeUserEntity } from '../../factories/make-user-entity'
import { UpdateUserSessionStatusUseCase } from './update-user-session-status.use-case'
import { SessionStatus } from '../../domain/entities/user-entity'

describe('UpdateUserSessionStatusUseCase', () => {
	let hasher: Hasher
	let userRepository: UserRepository
	let updateUserSessionStatusUseCase: UpdateUserSessionStatusUseCase

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	beforeEach(() => {
		userRepository = new InMemoryUserRepository()
		updateUserSessionStatusUseCase = new UpdateUserSessionStatusUseCase(
			userRepository,
		)
	})

	it('should not be able to update the user session status if the user does not exist', async () => {
		const result = await updateUserSessionStatusUseCase.execute({
			id: '999',
			status: SessionStatus.OFFLINE,
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

	it('should be able to update the user session status by id', async () => {
		const uuid = '123e4567-e89b-12d3-a456-426614174000'

		const user = await userRepository.create(
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

		const result = await updateUserSessionStatusUseCase.execute({
			id: user.props.id as number,
			status: SessionStatus.OFFLINE,
		})

		expect(result.isRight()).toBe(true)
		expect(userRepository.users.length).toBe(1)
		expect(userRepository.users[0].props.id).toBe(user.props.id)
		expect(userRepository.users[0].sessionStatus).toBe(
			SessionStatus.OFFLINE,
		)
	})
})
