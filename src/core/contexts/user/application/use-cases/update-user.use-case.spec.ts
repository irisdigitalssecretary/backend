import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { UpdateUserUseCase } from './update-user.use-case'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'
import { UserRepository } from '../../domain/repositories/user.repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserEmailExistsError } from '../errors/user-email-already-exists'
import { InvalidEmailError } from '@/core/shared/domain/errors/invalid-email-error'
import { InvalidPasswordError } from '@/core/shared/domain/errors/invalid-password-error'
import { UserNotFoundError } from '../../../../shared/application/errors/user-not-found'
import { UserFactory } from '../../domain/factories/make-user-entity'
import { OldPasswordInvalidError } from '../../domain/errors/old-password-invalid'
import { OldPasswordRequiredError } from '../../domain/errors/old-password-required'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'

describe('UpdateUserUseCase', () => {
	let hasher: Hasher
	let userRepository: UserRepository
	let updateUserUseCase: UpdateUserUseCase

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	beforeEach(() => {
		userRepository = new InMemoryUserRepository()
		updateUserUseCase = new UpdateUserUseCase(userRepository, hasher)
	})

	it('should be able to update a user', async () => {
		await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe2@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const oldData = { ...user.props }

		const newData = {
			name: 'John Doe 1',
			email: 'john.doe1@example.com',
			password: 'Test@1234',
			oldPassword: 'Test@123',
			sessionStatus: SessionStatus.AWAY,
			status: UserStatus.INACTIVE,
		}

		const result = await updateUserUseCase.execute(
			newData,
			user.props.id as number,
		)

		const userUpdated = userRepository.users[1]
		expect(result.isRight()).toBe(true)
		expect(result.value).toBeInstanceOf(UserEntity)
		expect(userUpdated).toMatchObject({
			name: newData.name,
			email: newData.email,
			password: expect.any(String),
			sessionStatus: newData.sessionStatus,
			status: newData.status,
		})
		expect(userUpdated.password).not.toBe(oldData.password)
		void expect(
			hasher.compare(newData.password, userUpdated.password ?? ''),
		).resolves.toBe(true)
	})

	it('should be able to update a user keeping the same email', async () => {
		await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe2@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const oldData = { ...user.props }

		const newData = {
			name: 'John Doe 1',
			email: 'john.doe@example.com',
			password: 'Test@1234',
			oldPassword: 'Test@123',
			sessionStatus: SessionStatus.AWAY,
			status: UserStatus.INACTIVE,
		}

		const result = await updateUserUseCase.execute(
			newData,
			user.props.id as number,
		)

		const userUpdated = userRepository.users[1]
		expect(result.isRight()).toBe(true)
		expect(result.value).toBeInstanceOf(UserEntity)
		expect(userUpdated).toMatchObject({
			name: newData.name,
			email: newData.email,
			password: expect.any(String),
			sessionStatus: newData.sessionStatus,
			status: newData.status,
		})
		expect(userUpdated.password).not.toBe(oldData.password)
		void expect(
			hasher.compare(newData.password, userUpdated.password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user if the user not exists', async () => {
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test@123',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			1,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
		expect(result.value).toBeInstanceOf(UserNotFoundError)
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to update a user if the email already exists', async () => {
		const emailToUpdate = 'john.doe@example.com'

		await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: emailToUpdate,
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const user2 = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe2@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		expect(userRepository.users.length).toBe(2)
		expect(userRepository.users[0].email).toBe(emailToUpdate)
		expect(userRepository.users[0].id).toBeDefined()

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: emailToUpdate,
				password: 'Test@123',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user2.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UserEmailExistsError)
		expect(result.value).toMatchObject({
			message: 'Já existe um usuário com este email cadastrado',
			statusCode: 409,
		})
	})

	it('should not be able to update a user if the old password is not provided and the password is provided', async () => {
		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test@1234',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(OldPasswordRequiredError)
		expect(result.value).toMatchObject({
			message: 'A senha atual é obrigatória para atualizar a senha.',
			statusCode: 401,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user if the old password is invalid', async () => {
		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test@1234',
				oldPassword: 'Teste@111',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(OldPasswordInvalidError)
		expect(result.value).toMatchObject({
			message: 'A senha atual é inválida.',
			statusCode: 401,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user if the password without uppercase letter', async () => {
		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: '12356789',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir pelo menos uma letra maiúscula.',
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user if the password without number', async () => {
		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: '@#$%&Abcdefg',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir pelo menos um número.',
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user with a password with less than 8 characters', async () => {
		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test@12',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir no mínimo 8 caracteres.',
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user with a password longer than 16 characters', async () => {
		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test@123456789101112131456',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir no máximo 16 caracteres.',
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user with a password without special character', async () => {
		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test12345',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			message: 'Senha deve possuir pelo menos um caractere especial.',
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user if the email is invalid', async () => {
		const user = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
				},
				hasher,
			),
		)

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@@example.com',
				password: 'Test@1234',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidEmailError)
		expect(result.value).toMatchObject({
			message: 'E-mail inválido',
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})
})
