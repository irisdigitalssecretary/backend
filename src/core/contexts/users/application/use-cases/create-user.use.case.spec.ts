import { BcryptHasher } from '@shared/infra/services/bcrypt-hasher'
import { CreateUserUseCase } from './create-user.use-case'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import { UserEntity } from '../../domain/entities/user-entity'
import { UserEmailExistsError } from '../../domain/errors/user-email-already-exists'
import { PasswordHash } from '@shared/domain/value-objects/password-hash'
import { InvalidEmailError } from '@shared/domain/errors/invalid-email'
import { InvalidPasswordError } from '@shared/domain/errors/invalid-password'

describe('CreateUserUseCase', () => {
	let hasher: Hasher
	let userRepository: UserRepository
	let createUserUseCase: CreateUserUseCase

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	beforeEach(() => {
		userRepository = new InMemoryUserRepository()
		createUserUseCase = new CreateUserUseCase(userRepository, hasher)
	})

	it('should be able to create a user', async () => {
		const data = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Teste@123',
		}
		const result = await createUserUseCase.execute(data)

		const user = userRepository.users[0]

		expect(result.isRight()).toBe(true)
		expect(result.value).toBeInstanceOf(UserEntity)
		expect(userRepository.users.length).toBe(1)
		expect(user).toBeInstanceOf(UserEntity)
		expect(user?.props.password).toBeInstanceOf(PasswordHash)
		expect(user?.props.password?.props.hashedPassword).not.toBe(
			data.password,
		)
		void expect(
			hasher.compare(
				data.password,
				user?.props.password?.props.hashedPassword ?? '',
			),
		).resolves.toBe(true)
	})

	it('should not be able to create a user with an email that already exists', async () => {
		await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Teste@123',
		})

		const result = await createUserUseCase.execute({
			name: 'John Doe 2',
			email: 'john.doe@example.com',
			password: 'Teste@123',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UserEmailExistsError)
		expect(userRepository.users.length).toBe(1)
	})

	it('should not be able to create a user with an invalid email', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe.com',
			password: 'Teste@123',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidEmailError)
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with an password with less than 8 characters', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '1234567',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with an password without uppercase letter', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '1234abcd',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with an password without number', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '@#$%&abcdefg',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with an password without special character', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123567',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(userRepository.users.length).toBe(0)
	})
})
