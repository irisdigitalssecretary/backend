import { PrismaService } from '@/core/shared/infra/database/prisma/prisma.service'
import {
	UserFilters,
	UserRepository,
} from '../../../domain/repositories/user-repository'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '../../../domain/entities/user-entity'
import { UserMapper } from '../mappers/user.mapper'
import { FindManyOptions } from '@/core/shared/domain/utils/find-many'
import { OffsetPagination } from '@/core/shared/domain/utils/offset-pagination'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaUserRepository implements UserRepository {
	public users: UserEntity[] = []

	constructor(private readonly prisma: PrismaService) {}

	async create(user: UserEntity): Promise<UserEntity> {
		const prisma = this.prisma

		const createdUser = await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		})

		return await UserMapper.toDomain(createdUser)
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
		})
		return user ? await UserMapper.toDomain(user) : null
	}

	async findById(id: number): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		})
		return user ? await UserMapper.toDomain(user) : null
	}

	async findByUuid(uuid: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({
			where: { uuid },
		})
		return user ? await UserMapper.toDomain(user) : null
	}

	async update(user: UserEntity): Promise<UserEntity> {
		const prisma = this.prisma

		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
				phone: user.phone,
				sessionStatus: user.sessionStatus,
				status: user.status,
			},
		})

		return await UserMapper.toDomain(updatedUser)
	}

	async delete(id: number): Promise<void> {
		await this.prisma.user.delete({
			where: { id },
		})
	}

	async updateStatus(id: number, status: UserStatus): Promise<UserEntity> {
		const prisma = this.prisma

		const updatedUser = await prisma.user.update({
			where: { id },
			data: { status },
		})
		return await UserMapper.toDomain(updatedUser)
	}

	async findManyByOffsetPagination(
		props: FindManyOptions<UserFilters, OffsetPagination>,
	): Promise<UserEntity[]> {
		const prisma = this.prisma

		const users = await prisma.user.findMany({
			where: props.filters,
			skip: props.pagination?.offset,
			take: props.pagination?.limit,
			orderBy: props.orderBy,
		})

		return (await Promise.all(
			users.map(void UserMapper.toDomain),
		)) as UserEntity[]
	}

	async updateSessionStatus(
		id: number,
		sessionStatus: SessionStatus,
	): Promise<UserEntity> {
		const prisma = this.prisma

		const updatedUser = await prisma.user.update({
			where: { id },
			data: { sessionStatus },
		})
		return await UserMapper.toDomain(updatedUser)
	}
}
