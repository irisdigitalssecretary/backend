import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { UpdateUserUseCase } from './update-user.use-case'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '../../domain/entities/user-entity'
import { UserEmailExistsError } from './errors/user-email-already-exists'
import { InvalidEmailError } from '@/core/shared/domain/errors/invalid-email-error'
import { InvalidPasswordError } from '@/core/shared/domain/errors/invalid-password-error'
import { UserNotFoundError } from './errors/user-not-found'
import { makeUserEntity } from '../../factories/make-user-entity'
import { OldPasswordInvalidError } from '../../domain/errors/old-password-invalid'
import { OldPasswordRequiredError } from '../../domain/errors/old-password-required'

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
			statusCode: 404,
		})
		expect(result.value).toBeInstanceOf(UserNotFoundError)
		expect(userRepository.users.length).toBe(0)
	})

	it('should not be able to update a user if the email already exists', async () => {
		const emailToUpdate = 'john.doe@example.com'

		await userRepository.create(
			await makeUserEntity(
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
			await makeUserEntity(
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
			statusCode: 409,
		})
	})

	it('should not be able to update a user if the old password not exists and the password is provided', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
			statusCode: 401,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user if the old password is invalid', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
			statusCode: 401,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user if the password is invalid', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user with a password with less than 8 characters', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user with a password with more than 16 characters', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user with a password without uppercase letter', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
				password: 'test@123',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user with a password without number', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
				password: 'Test@abcd',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
		expect(result.value).toMatchObject({
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user with a password without special character', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should not be able to update a user if the email is invalid', async () => {
		const user = await userRepository.create(
			await makeUserEntity(
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
			statusCode: 400,
		})
		void expect(
			hasher.compare('Test@123', userRepository.users[0].password ?? ''),
		).resolves.toBe(true)
	})

	it('should be able to update a user', async () => {
		await userRepository.create(
			await makeUserEntity(
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
			await makeUserEntity(
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
		expect(userUpdated.name).toBe(newData.name)
		expect(userUpdated.email).toBe(newData.email)
		expect(userUpdated.password).not.toBe(oldData.password)

		void expect(
			hasher.compare(newData.password, userUpdated.password ?? ''),
		).resolves.toBe(true)

		expect(userUpdated.sessionStatus).toBe(newData.sessionStatus)
		expect(userUpdated.status).toBe(newData.status)
	})
})
