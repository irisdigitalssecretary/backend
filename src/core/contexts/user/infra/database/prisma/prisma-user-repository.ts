import { PrismaService } from '@shared/infra/database/prisma/prisma.service'
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
import { FindManyOptions } from '@shared/domain/utils/find-many'
import { OffsetPagination } from '@shared/domain/utils/offset-pagination'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaUserRepository implements UserRepository {
	public users: UserEntity[] = []

	constructor(private readonly prisma: PrismaService) {}

	async create(user: UserEntity): Promise<UserEntity> {
		const prisma = this.prisma

		const createdUser = await prisma.user.create({
			data: UserMapper.toPersistence(user),
		})

		return await UserMapper.toDomain(createdUser)
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findFirst({ where: { email } })
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
			where: { id: user.props.id },
			data: UserMapper.toPersistence(user),
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

		const domainUsers: UserEntity[] = await Promise.all(
			users.map((u) => UserMapper.toDomain(u)),
		)

		return domainUsers
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
