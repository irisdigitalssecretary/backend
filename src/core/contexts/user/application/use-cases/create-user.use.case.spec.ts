import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { CreateUserUseCase } from './create-user.use-case'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import { UserEntity } from '../../domain/entities/user-entity'
import { UserEmailExistsError } from '../../domain/errors/user-email-already-exists'
import { InvalidEmailError } from '@shared/domain/errors/invalid-email'
import { InvalidPasswordError } from '@shared/domain/errors/invalid-password'
import { InvalidPhoneError } from '@/core/shared/domain/errors/invalid-phone'

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
		expect(user?.password).not.toBe(data.password)
		void expect(
			hasher.compare(data.password, user?.password ?? ''),
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

	it('should not be able to create a user with an password with more than 16 characters', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test@123456789101112131456',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with an phone with more than 16 characters', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Teste@123',
			phone: '12345678901234567890',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPhoneError)
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
