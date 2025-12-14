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
import { InMemoryCompanyRepository } from '@/core/contexts/company/tests/in-memory/in-memory.company.repository'
import { CompanyRepository } from '@/core/contexts/company/domain/repositories/company.repository'
import { CompanyEntity } from '@/core/contexts/company/domain/entities/company.entity'
import { CompanyFactory } from '@/core/contexts/company/domain/factories/make-company-entity'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { TaxIdValidatorService } from '@/core/shared/infra/services/validators/tax-id-validator.service'
import { ZipCodeValidatorService } from '@/core/shared/infra/services/validators/zip-code-validator.service'
import { TaxIdValidator } from '@/core/shared/domain/infra/services/validators/tax-id-validator'
import { ZipCodeValidator } from '@/core/shared/domain/infra/services/validators/zip-code-validator'
import { makeUser } from '@/core/shared/tests/unit/factories/make-user-test.factory'
import { makeCompany } from '@/core/shared/tests/unit/factories/make-company-test.factory'

describe('UpdateUserUseCase', () => {
	let hasher: Hasher
	let userRepository: UserRepository
	let companyRepository: CompanyRepository
	let updateUserUseCase: UpdateUserUseCase
	let userCompany: CompanyEntity
	let userToUpdate: UserEntity
	let taxIdValidator: TaxIdValidator
	let zipCodeValidator: ZipCodeValidator

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	beforeEach(async () => {
		userRepository = new InMemoryUserRepository()
		updateUserUseCase = new UpdateUserUseCase(userRepository, hasher)
		companyRepository = new InMemoryCompanyRepository()

		taxIdValidator = new TaxIdValidatorService()
		zipCodeValidator = new ZipCodeValidatorService()

		userCompany = await makeCompany()

		await userRepository.create(
			await makeUser(Number(userCompany.props.id), hasher),
		)

		userToUpdate = await userRepository.create(
			await makeUser(Number(userCompany.props.id), hasher),
		)
	})

	it('should be able to update a user', async () => {
		const oldData = { ...userToUpdate.props }

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
			userToUpdate.props.id as number,
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
		const oldData = { ...userToUpdate.props }

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
			userToUpdate.props.id as number,
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
			123839478235,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
		expect(result.value).toBeInstanceOf(UserNotFoundError)
		expect(userRepository.users.length).toBe(2)
	})

	it('should not be able to update a user if the email already exists', async () => {
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: `john.doe${userToUpdate.companyId}@example.com`,
				password: 'Test@123',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			userToUpdate.props.id as number,
		)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UserEmailExistsError)
		expect(result.value).toMatchObject({
			message: 'Já existe um usuário com este email cadastrado',
			statusCode: 409,
		})
	})

	it('should be able to update a user with an email that already exists if the owner user belongs to a different company', async () => {
		userCompany = await companyRepository.create(
			CompanyFactory.create(
				{
					name: 'Company 2',
					email: 'company2@example.com',
					taxId: '01894147000216',
					address: '123 Main St',
					city: 'Anytown',
					state: 'Rio de Janeiro',
					countryId: 1,
					businessArea: 'Technology',
					personType: PersonType.COMPANY,
					zip: '89160306',
					landline: '551135211980',
					phone: '5511988899090',
					description: 'Company 2 description is valid!',
				},
				{
					taxIdValidator,
					zipCodeValidator,
					countryCode: 'BR',
				},
			),
		)

		userToUpdate = await userRepository.create(
			await UserFactory.create(
				{
					name: 'John Doe',
					email: 'john.doe1@example.com',
					password: 'Test@123',
					sessionStatus: SessionStatus.ONLINE,
					status: UserStatus.ACTIVE,
					companyId: Number(userCompany.props.id),
				},
				hasher,
			),
		)

		const newData = {
			name: 'John Doe',
			email: `john.doe${userToUpdate.props.id}@example.com`,
			password: 'Test@123',
			oldPassword: 'Test@123',
			sessionStatus: SessionStatus.ONLINE,
			status: UserStatus.ACTIVE,
		}

		const result = await updateUserUseCase.execute(
			newData,
			userToUpdate.props.id as number,
		)

		expect(result.isRight()).toBe(true)
		expect(userRepository.users[2]).toMatchObject({
			name: newData.name,
			email: newData.email,
			password: expect.any(String),
			sessionStatus: newData.sessionStatus,
			status: newData.status,
			companyId: userToUpdate.props.companyId,
		})
	})

	it('should not be able to update a user if the old password is not provided and the password is provided', async () => {
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test@1234',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			userToUpdate.props.id as number,
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
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test@1234',
				oldPassword: 'Teste@111',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			userToUpdate.props.id as number,
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
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: '12356789',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			userToUpdate.props.id as number,
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
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: '@#$%&Abcdefg',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			userToUpdate.props.id as number,
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
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test@12',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			userToUpdate.props.id as number,
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
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test@123456789101112131456',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			userToUpdate.props.id as number,
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
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'Test12345',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			userToUpdate.props.id as number,
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
		const result = await updateUserUseCase.execute(
			{
				name: 'John Doe',
				email: 'john.doe@@example.com',
				password: 'Test@1234',
				oldPassword: 'Test@123',
				sessionStatus: SessionStatus.ONLINE,
				status: UserStatus.ACTIVE,
			},
			userToUpdate.props.id as number,
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
