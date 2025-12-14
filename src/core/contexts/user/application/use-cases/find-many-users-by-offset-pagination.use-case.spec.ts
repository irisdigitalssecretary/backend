import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'
import { UserRepository } from '../../domain/repositories/user.repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserFactory } from '../../domain/factories/make-user-entity'
import { FindManyUsersByOffsetPaginationUseCase } from './find-many-users-by-offset-pagination.use-case'
import { OffsetPagination } from '@/core/shared/domain/value-objects/offset-pagination'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { makeCompany } from '@/core/shared/tests/unit/factories/make-company-test.factory'
import { CompanyEntity } from '@/core/contexts/company/domain/entities/company.entity'

describe('FindManyUsersByOffsetPaginationUseCase', () => {
	let hasher: Hasher
	let userRepository: UserRepository
	let findManyUsersByOffsetPaginationUseCase: FindManyUsersByOffsetPaginationUseCase
	let company: CompanyEntity

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	beforeEach(async () => {
		userRepository = new InMemoryUserRepository()
		findManyUsersByOffsetPaginationUseCase =
			new FindManyUsersByOffsetPaginationUseCase(userRepository)

		company = await makeCompany()

		const company2 = await makeCompany({
			taxId: '01894147000216',
		})
		const testUsers = [
			{
				id: 1,
				name: 'Alice Silva',
				email: 'alice@example.com',
				status: UserStatus.ACTIVE,
				sessionStatus: SessionStatus.ONLINE,
			},
			{
				id: 2,
				name: 'Bruno Santos',
				email: 'bruno@example.com',
				status: UserStatus.INACTIVE,
				sessionStatus: SessionStatus.OFFLINE,
			},
			{
				id: 3,
				name: 'Carlos Oliveira',
				email: 'carlos@example.com',
				status: UserStatus.ACTIVE,
				sessionStatus: SessionStatus.AWAY,
			},
			{
				id: 4,
				name: 'Diana Costa',
				email: 'diana@example.com',
				status: UserStatus.ACTIVE,
				sessionStatus: SessionStatus.BUSY,
			},
			{
				id: 5,
				name: 'Eduardo Lima',
				email: 'eduardo@test.com',
				status: UserStatus.INACTIVE,
				sessionStatus: SessionStatus.OFFLINE,
			},
		]

		for (const companyData of [company, company2]) {
			for (const userData of testUsers) {
				const user = await UserFactory.create(
					{
						id: userData.id,
						name: userData.name,
						email: userData.email,
						password: `${userData.id}@Example.com`,
						status: userData.status,
						sessionStatus: userData.sessionStatus,
						companyId: companyData.props.id!,
					},
					hasher,
				)
				await userRepository.create(user)
			}
		}
	})

	describe('Pagination', () => {
		it('should be able to fetch users with default pagination', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
		})

		it('should be able to respect pagination limit', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					pagination: OffsetPagination.create(2, 1),
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(2)
		})

		it('should be able to navigate between pages correctly', async () => {
			const firstPageResult =
				await findManyUsersByOffsetPaginationUseCase.execute(
					{
						filters: {},
						pagination: OffsetPagination.create(2, 1),
					},
					company.props.id!,
				)

			const secondPageResult =
				await findManyUsersByOffsetPaginationUseCase.execute(
					{
						filters: {},
						pagination: OffsetPagination.create(2, 2),
					},
					company.props.id!,
				)

			expect(firstPageResult.isRight()).toBe(true)
			expect(secondPageResult.isRight()).toBe(true)

			const firstPageUsers = firstPageResult.value as UserEntity[]
			const secondPageUsers = secondPageResult.value as UserEntity[]

			expect(firstPageUsers).toHaveLength(2)
			expect(secondPageUsers).toHaveLength(2)

			const firstPageIds = firstPageUsers.map((user) => user.uuid)
			const secondPageIds = secondPageUsers.map((user) => user.uuid)

			expect(firstPageIds).not.toEqual(secondPageIds)
		})

		it('should be able to return empty list when page exceeds total records', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					pagination: OffsetPagination.create(10, 10),
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(0)
		})
	})

	describe('Filters', () => {
		it('should be able to filter users by id', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { id: 1 },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(1)
			expect(users[0].props.id).toBe(1)
		})

		it('should be able to filter users by uuid', async () => {
			const allUsersResult =
				await findManyUsersByOffsetPaginationUseCase.execute(
					{
						filters: {},
					},
					company.props.id!,
				)
			const allUsers = allUsersResult.value as UserEntity[]
			const targetUuid = allUsers[0].uuid

			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { uuid: targetUuid },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(1)
			expect(users[0].uuid).toBe(targetUuid)
		})

		it('should be able to filter users by name', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { name: 'Alice' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(1)
			expect(users[0].name).toContain('Alice')
		})

		it('should be able to filter users by email', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { email: 'bruno@example.com' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(1)
			expect(users[0].email).toBe('bruno@example.com')
		})

		it('should be able to filter users by phone', async () => {
			const allUsersResult =
				await findManyUsersByOffsetPaginationUseCase.execute(
					{
						filters: {},
					},
					company.props.id!,
				)
			const allUsers = allUsersResult.value as UserEntity[]
			const targetPhone = allUsers[0].phone

			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { phone: targetPhone },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users.length).toBeGreaterThanOrEqual(1)
			users.forEach((user) => {
				expect(user.phone).toBe(targetPhone)
			})
		})

		it('should be able to filter users by status', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { status: UserStatus.ACTIVE },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(3)
			users.forEach((user) => {
				expect(user.status).toBe(UserStatus.ACTIVE)
			})
		})

		it('should be able to filter users by session status', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { sessionStatus: SessionStatus.OFFLINE },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(2)
			users.forEach((user) => {
				expect(user.sessionStatus).toBe(SessionStatus.OFFLINE)
			})
		})

		it('should be able to filter users by createdAt', async () => {
			const allUsersResult =
				await findManyUsersByOffsetPaginationUseCase.execute(
					{
						filters: {},
					},
					company.props.id!,
				)
			const allUsers = allUsersResult.value as UserEntity[]
			const targetCreatedAt = allUsers[0].createdAt

			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { createdAt: targetCreatedAt },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users.length).toBeGreaterThanOrEqual(1)
		})

		it('should be able to filter users by updatedAt', async () => {
			const allUsersResult =
				await findManyUsersByOffsetPaginationUseCase.execute(
					{
						filters: {},
					},
					company.props.id!,
				)
			const allUsers = allUsersResult.value as UserEntity[]
			const targetUpdatedAt = allUsers[0].updatedAt

			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { updatedAt: targetUpdatedAt },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users.length).toBeGreaterThanOrEqual(1)
		})

		it('should be able to combine multiple filters', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {
						status: UserStatus.ACTIVE,
						sessionStatus: SessionStatus.ONLINE,
					},
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(1)
			expect(users[0].name).toContain('Alice')
			expect(users[0].status).toBe(UserStatus.ACTIVE)
			expect(users[0].sessionStatus).toBe(SessionStatus.ONLINE)
		})

		it('should be able to return empty list when no user matches filters', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { name: 'Usuário Inexistente' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(0)
		})
	})

	describe('Ordering', () => {
		it('should be able to sort users by id in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { id: 'asc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(users[i - 1].props.id!).toBeLessThanOrEqual(
					users[i].props.id!,
				)
			}
		})

		it('should be able to sort users by id in descending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { id: 'desc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(users[i - 1].props.id!).toBeGreaterThanOrEqual(
					users[i].props.id!,
				)
			}
		})

		it('should be able to sort users by uuid in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { uuid: 'asc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(
					users[i - 1].uuid.localeCompare(users[i].uuid),
				).toBeLessThanOrEqual(0)
			}
		})

		it('should be able to sort users by uuid in descending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { uuid: 'desc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(
					users[i - 1].uuid.localeCompare(users[i].uuid),
				).toBeGreaterThanOrEqual(0)
			}
		})

		it('should be able to sort users by name in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { name: 'asc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(
					users[i - 1].name.localeCompare(users[i].name),
				).toBeLessThanOrEqual(0)
			}
		})

		it('should be able to sort users by name in descending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { name: 'desc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(
					users[i - 1].name.localeCompare(users[i].name),
				).toBeGreaterThanOrEqual(0)
			}
		})

		it('should be able to sort users by email in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { email: 'asc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(
					users[i - 1].email.localeCompare(users[i].email),
				).toBeLessThanOrEqual(0)
			}
		})

		it('should be able to sort users by email in descending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { email: 'desc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(
					users[i - 1].email.localeCompare(users[i].email),
				).toBeGreaterThanOrEqual(0)
			}
		})

		it('should be able to sort users by phone in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { phone: 'asc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(
					users[i - 1].phone.localeCompare(users[i].phone),
				).toBeLessThanOrEqual(0)
			}
		})

		it('should be able to sort users by phone in descending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { phone: 'desc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(
					users[i - 1].phone.localeCompare(users[i].phone),
				).toBeGreaterThanOrEqual(0)
			}
		})

		it('should be able to sort users by status in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { status: 'asc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
		})

		it('should be able to sort users by status in descending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { status: 'desc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
		})

		it('should be able to sort users by sessionStatus in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { sessionStatus: 'asc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
		})

		it('should be able to sort users by sessionStatus in descending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { sessionStatus: 'desc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
		})

		it('should be able to sort users by createdAt in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { createdAt: 'asc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(users[i - 1].createdAt.getTime()).toBeLessThanOrEqual(
					users[i].createdAt.getTime(),
				)
			}
		})

		it('should be able to sort users by createdAt in descending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { createdAt: 'desc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(users[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(
					users[i].createdAt.getTime(),
				)
			}
		})

		it('should be able to sort users by updatedAt in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { updatedAt: 'asc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(users[i - 1].updatedAt.getTime()).toBeLessThanOrEqual(
					users[i].updatedAt.getTime(),
				)
			}
		})

		it('should be able to sort users by updatedAt in descending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { updatedAt: 'desc' },
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			for (let i = 1; i < users.length; i++) {
				expect(users[i - 1].updatedAt.getTime()).toBeGreaterThanOrEqual(
					users[i].updatedAt.getTime(),
				)
			}
		})
	})

	describe('Complex Combinations', () => {
		it('should be able to apply filters, ordering and pagination simultaneously', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { status: UserStatus.ACTIVE },
					orderBy: { name: 'asc' },
					pagination: OffsetPagination.create(2, 1),
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(2)

			users.forEach((user) => {
				expect(user.status).toBe(UserStatus.ACTIVE)
			})

			expect(
				users[0].name.localeCompare(users[1].name),
			).toBeLessThanOrEqual(0)
		})

		it('should be able to work with empty filters', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
		})

		it('should be able to work without optional parameters', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
		})
	})

	describe('Select Fields', () => {
		it('should be able to select specific fields', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['name', 'email'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.name).toBeDefined()
				expect(user.email).toBeDefined()
			})
		})

		it('should be able to select only id field', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['id'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.props.id).toBeDefined()
			})
		})

		it('should be able to select only uuid field', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['uuid'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.uuid).toBeDefined()
			})
		})

		it('should be able to select only name field', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['name'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.name).toBeDefined()
			})
		})

		it('should be able to select only email field', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['email'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.email).toBeDefined()
			})
		})

		it('should be able to select only phone field', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['phone'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.phone).toBeDefined()
			})
		})

		it('should be able to select only status field', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['status'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.status).toBeDefined()
			})
		})

		it('should be able to select only sessionStatus field', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['sessionStatus'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.sessionStatus).toBeDefined()
			})
		})

		it('should be able to select only createdAt field', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['createdAt'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.createdAt).toBeDefined()
			})
		})

		it('should be able to select only updatedAt field', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: ['updatedAt'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.updatedAt).toBeDefined()
			})
		})

		it('should be able to select multiple fields including all field types', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					select: [
						'id',
						'uuid',
						'name',
						'email',
						'phone',
						'status',
						'sessionStatus',
						'createdAt',
						'updatedAt',
					],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.props.id).toBeDefined()
				expect(user.uuid).toBeDefined()
				expect(user.name).toBeDefined()
				expect(user.email).toBeDefined()
				expect(user.phone).toBeDefined()
				expect(user.status).toBeDefined()
				expect(user.sessionStatus).toBeDefined()
				expect(user.createdAt).toBeDefined()
				expect(user.updatedAt).toBeDefined()
			})
		})

		it('should be able to combine select with filters', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { status: UserStatus.ACTIVE },
					select: ['name', 'email', 'status'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(3)

			users.forEach((user) => {
				expect(user.name).toBeDefined()
				expect(user.email).toBeDefined()
				expect(user.status).toBe(UserStatus.ACTIVE)
			})
		})

		it('should be able to combine select with pagination', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					pagination: OffsetPagination.create(2, 1),
					select: ['name', 'email'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(2)

			users.forEach((user) => {
				expect(user.name).toBeDefined()
				expect(user.email).toBeDefined()
			})
		})

		it('should be able to combine select with ordering', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { name: 'asc' },
					select: ['name', 'email'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)

			users.forEach((user) => {
				expect(user.name).toBeDefined()
				expect(user.email).toBeDefined()
			})

			for (let i = 1; i < users.length; i++) {
				expect(
					users[i - 1].name.localeCompare(users[i].name),
				).toBeLessThanOrEqual(0)
			}
		})

		it('should be able to combine select with filters, pagination and ordering', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { status: UserStatus.ACTIVE },
					orderBy: { name: 'asc' },
					pagination: OffsetPagination.create(2, 1),
					select: ['name', 'email', 'status'],
				},
				company.props.id!,
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(2)

			users.forEach((user) => {
				expect(user.name).toBeDefined()
				expect(user.email).toBeDefined()
				expect(user.status).toBe(UserStatus.ACTIVE)
			})

			expect(
				users[0].name.localeCompare(users[1].name),
			).toBeLessThanOrEqual(0)
		})
	})
})
