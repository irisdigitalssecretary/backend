import { BcryptHasher } from '@shared/infra/services/bcrypt-hasher'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import { UserNotFoundError } from '../../domain/errors/user-not-found'
import { makeUserEntity } from '../../factories/make-user-entity'
import { DeleteUserByIdUseCase } from './delete-user-by-id.use-case'

describe('DeleteUserByIdUseCase', () => {
	let hasher: Hasher
	let userRepository: UserRepository
	let deleteUserByIdUseCase: DeleteUserByIdUseCase

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	beforeEach(() => {
		userRepository = new InMemoryUserRepository()
		deleteUserByIdUseCase = new DeleteUserByIdUseCase(userRepository)
	})

	it('should not be able to delete a user if it does not exist', async () => {
		const result = await deleteUserByIdUseCase.execute({
			id: '999',
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

	it('should be able to delete a user by id', async () => {
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

		const result = await deleteUserByIdUseCase.execute({
			id: user.props.id as string,
		})

		expect(result.isRight()).toBe(true)
		expect(userRepository.users.length).toBe(0)
	})
})
