import { BcryptHasher } from '@shared/infra/services/bcrypt-hasher'
import { UpdateUserUseCase } from './update-user.use-case'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '../../domain/entities/user-entity'
import { UserEmailExistsError } from '../../domain/errors/user-email-already-exists'
import { InvalidEmailError } from '@shared/domain/errors/invalid-email'
import { InvalidPasswordError } from '@shared/domain/errors/invalid-password'
import { UserNotFoundError } from '../../domain/errors/user-not-found'
import { makeUserEntity } from '../../factories/make-user-entity'
import { OldPasswordRequiredError } from '../../domain/errors/old-password-required'
import { OldPasswordInvalidError } from '../../domain/errors/old-password-invalid'

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
			'1',
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof UserNotFoundError &&
				result.value.statusCode === 404,
		).toBe(true)
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
		expect(userRepository.users[0].props.email.value).toBe(emailToUpdate)
		expect(userRepository.users[0].props.id).toBeDefined()

		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: emailToUpdate,
				password: 'Test@123',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user2.props.id as string,
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof UserEmailExistsError &&
				result.value.statusCode === 409,
		).toBe(true)
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
			user.props.id as string,
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof OldPasswordRequiredError &&
				result.value.statusCode === 401,
		).toBe(true)
		void expect(
			hasher.compare(
				'Test@123',
				userRepository.users[0].props.password?.props.hashedPassword ??
					'',
			),
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
				oldPassword: 'Test@abc',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			user.props.id as string,
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof OldPasswordInvalidError &&
				result.value.statusCode === 401,
		).toBe(true)
		void expect(
			hasher.compare(
				'Test@123',
				userRepository.users[0].props.password?.props.hashedPassword ??
					'',
			),
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
			user.props.id as string,
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof InvalidPasswordError &&
				result.value.statusCode === 400,
		).toBe(true)
		void expect(
			hasher.compare(
				'Test@123',
				userRepository.users[0].props.password?.props.hashedPassword ??
					'',
			),
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
			user.props.id as string,
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof InvalidPasswordError &&
				result.value.statusCode === 400,
		).toBe(true)
		void expect(
			hasher.compare(
				'Test@123',
				userRepository.users[0].props.password?.props.hashedPassword ??
					'',
			),
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
			user.props.id as string,
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof InvalidPasswordError &&
				result.value.statusCode === 400,
		).toBe(true)
		void expect(
			hasher.compare(
				'Test@123',
				userRepository.users[0].props.password?.props.hashedPassword ??
					'',
			),
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
			user.props.id as string,
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof InvalidPasswordError &&
				result.value.statusCode === 400,
		).toBe(true)
		void expect(
			hasher.compare(
				'Test@123',
				userRepository.users[0].props.password?.props.hashedPassword ??
					'',
			),
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
			user.props.id as string,
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof InvalidPasswordError &&
				result.value.statusCode === 400,
		).toBe(true)
		void expect(
			hasher.compare(
				'Test@123',
				userRepository.users[0].props.password?.props.hashedPassword ??
					'',
			),
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
			user.props.id as string,
		)

		expect(result.isLeft()).toBe(true)
		expect(
			result.value instanceof InvalidEmailError &&
				result.value.statusCode === 400,
		).toBe(true)
		void expect(
			hasher.compare(
				'Test@123',
				userRepository.users[0].props.password?.props.hashedPassword ??
					'',
			),
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

		const data = {
			name: 'John Doe 1',
			email: 'john.doe1@example.com',
			password: 'Test@1234',
			oldPassword: 'Test@123',
			sessionStatus: SessionStatus.AWAY,
			status: UserStatus.INACTIVE,
		}

		const result = await updateUserUseCase.execute(
			data,
			user.props.id as string,
		)

		const userUpdated = userRepository.users[1]

		expect(result.isRight()).toBe(true)
		expect(result.value).toBeInstanceOf(UserEntity)
		expect(userUpdated.props.name).toBe(data.name)
		expect(userUpdated.props.email.value).toBe(data.email)
		expect(userUpdated.props.password?.props.hashedPassword).not.toBe(
			user.props.password?.props.hashedPassword,
		)

		void expect(
			hasher.compare(
				data.password,
				userUpdated.props.password?.props.hashedPassword ?? '',
			),
		).resolves.toBe(true)

		expect(userUpdated.props.sessionStatus).toBe(data.sessionStatus)
		expect(userUpdated.props.status).toBe(data.status)
	})
})
