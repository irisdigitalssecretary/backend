import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { UserRepository } from '../../domain/repositories/user-repository'
import { InMemoryUserRepository } from '../../tests/in-memory/in-memory.user-repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserFactory } from '../../factories/make-user-entity'
import { FindManyUsersByOffsetPaginationUseCase } from './find-many-users-by-offset-pagination.use-case'
import { OffsetPagination } from '@/core/shared/domain/utils/offset-pagination'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'

describe('FindManyUsersByOffsetPaginationUseCase', () => {
	let hasher: Hasher
	let userRepository: UserRepository
	let findManyUsersByOffsetPaginationUseCase: FindManyUsersByOffsetPaginationUseCase

	beforeAll(() => {
		hasher = new BcryptHasher()
	})

	beforeEach(async () => {
		userRepository = new InMemoryUserRepository()
		findManyUsersByOffsetPaginationUseCase =
			new FindManyUsersByOffsetPaginationUseCase(userRepository)

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

		for (const userData of testUsers) {
			const user = await UserFactory.create(
				{
					id: userData.id,
					name: userData.name,
					email: userData.email,
					password: `${userData.id}@Example.com`,
					status: userData.status,
					sessionStatus: userData.sessionStatus,
				},
				hasher,
			)
			await userRepository.create(user)
		}
	})

	describe('Pagination', () => {
		it('should be able to fetch users with default pagination', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
				},
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
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(2)
		})

		it('should be able to navigate between pages correctly', async () => {
			const firstPageResult =
				await findManyUsersByOffsetPaginationUseCase.execute({
					filters: {},
					pagination: OffsetPagination.create(2, 1),
				})

			const secondPageResult =
				await findManyUsersByOffsetPaginationUseCase.execute({
					filters: {},
					pagination: OffsetPagination.create(2, 2),
				})

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
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(0)
		})
	})

	describe('Filters', () => {
		it('should be able to filter users by name', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { name: 'Alice' },
				},
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
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(1)
			expect(users[0].email).toBe('bruno@example.com')
		})

		it('should be able to filter users by status', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: { status: UserStatus.ACTIVE },
				},
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
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(2)
			users.forEach((user) => {
				expect(user.sessionStatus).toBe(SessionStatus.OFFLINE)
			})
		})

		it('should be able to combine multiple filters', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {
						status: UserStatus.ACTIVE,
						sessionStatus: SessionStatus.ONLINE,
					},
				},
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
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(0)
		})
	})

	describe('Ordering', () => {
		it('should be able to sort users by name in ascending order', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { name: 'asc' },
				},
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

		it('should be able to sort users by status', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{
					filters: {},
					orderBy: { status: 'asc' },
				},
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
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
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
		})

		it('should be able to work without optional parameters', async () => {
			const result = await findManyUsersByOffsetPaginationUseCase.execute(
				{},
			)

			expect(result.isRight()).toBe(true)
			const users = result.value as UserEntity[]
			expect(users).toHaveLength(5)
		})
	})
})
