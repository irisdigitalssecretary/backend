import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { CreateUserUseCase } from './create-user.use-case'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'
import { UserRepository } from '../../domain/repositories/user.repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserEmailExistsError } from '../errors/user-email-already-exists'
import { InvalidEmailError } from '@/core/shared/domain/errors/invalid-email-error'
import { InvalidPasswordError } from '@/core/shared/domain/errors/invalid-password-error'
import { InvalidPhoneError } from '@/core/shared/domain/errors/invalid-phone-error'

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
		expect(user).toMatchObject({
			email: 'john.doe@example.com',
			name: 'John Doe',
		})
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
		expect(result.value).toMatchObject({
			message: 'Já existe um usuário com este email cadastrado',
			statusCode: 409,
		})
		expect(userRepository.users.length).toBe(1)
	})

	it('should be able to create a user with an email that already exists if the owner user belongs to a different company', () => {
		expect(true).toBe(false)
	})

	it('should not be able to create a user with an invalid email', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe.com',
			password: 'Teste@123',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidEmailError)
		expect(result.value).toMatchObject({
			message: 'E-mail inválido',
			statusCode: 400,
		})
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with an email longer than 100 characters', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'a'.repeat(90) + '@example.com',
			password: 'Teste@123',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidEmailError)
		expect(result.value).toMatchObject({
			message: 'E-mail deve possuir no máximo 100 caracteres.',
			statusCode: 400,
		})
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with a password with less than 8 characters', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '1234567',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir no mínimo 8 caracteres.',
			statusCode: 400,
		})
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with a password longer than 16 characters', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test@123456789101112131456',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir no máximo 16 caracteres.',
			statusCode: 400,
		})
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with a password without uppercase letter', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '1234abcd',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir pelo menos uma letra maiúscula.',
			statusCode: 400,
		})
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with a password without number', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '@#$%&Abcdefg',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir pelo menos um número.',
			statusCode: 400,
		})
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with a password without special character', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123567',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir pelo menos um caractere especial.',
			statusCode: 400,
		})
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with an phone longer than 16 characters', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Teste@123',
			phone: '12345678901234567890',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPhoneError)
		expect(result.value).toMatchObject({
			message: 'Telefone deve possuir no máximo 16 caracteres.',
			statusCode: 400,
		})
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to create a user with a phone number less than 10 characters', async () => {
		const result = await createUserUseCase.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Teste@123',
			phone: '123456789',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPhoneError)
		expect(result.value).toMatchObject({
			message: 'Telefone deve possuir no mínimo 10 caracteres.',
			statusCode: 400,
		})
		expect(userRepository.users.length).toBe(0)
	})
})
