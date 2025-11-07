import {
	UserFields,
	UserRepository,
	UserSelectableFields,
} from '../../../domain/repositories/user-repository'
import { UserEntity } from '../../../domain/entities/user.entity'
import { UserMapper } from '../mappers/user.mapper'
import { FindManyOptions } from '@/core/shared/domain/utils/types/find-many'
import { OffsetPagination } from '@/core/shared/domain/value-objects/offset-pagination'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { Prisma } from 'generated/prisma'

@Injectable()
export class PrismaUserRepository implements UserRepository {
	public users: UserEntity[] = []

	constructor(private readonly prisma: PrismaService) {}

	async create(user: UserEntity): Promise<UserEntity> {
		const prisma = this.prisma

		const createdUser = await prisma.user.create({
			data: UserMapper.toPersistence(user),
		})

		return UserMapper.toDomain(createdUser)
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findFirst({ where: { email } })
		return user ? UserMapper.toDomain(user) : null
	}

	async findById(id: number): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		})

		return user ? UserMapper.toDomain(user) : null
	}

	async findByUuid(uuid: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({
			where: { uuid },
		})
		return user ? UserMapper.toDomain(user) : null
	}

	async update(user: UserEntity): Promise<UserEntity> {
		const prisma = this.prisma

		const updatedUser = await prisma.user.update({
			where: { id: user.props.id },
			data: UserMapper.toPersistence(user),
		})

		return UserMapper.toDomain(updatedUser)
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
		return UserMapper.toDomain(updatedUser)
	}

	async findManyByOffsetPagination(
		props: FindManyOptions<
			Partial<UserFields>,
			OffsetPagination,
			UserSelectableFields
		>,
	): Promise<UserEntity[]> {
		const prisma = this.prisma
		const { filters } = props
		const whereClause: Prisma.UserWhereInput = {}

		if (filters?.name) {
			whereClause.name = {
				contains: filters.name,
				mode: 'insensitive',
			}
		}

		if (filters?.email) {
			whereClause.email = {
				contains: filters.email,
				mode: 'insensitive',
			}
		}

		if (filters?.phone) {
			whereClause.phone = {
				contains: filters.phone,
				mode: 'insensitive',
			}
		}

		const users = await prisma.user.findMany({
			where: whereClause,
			skip: props.pagination?.after,
			take: props.pagination?.limit,
			orderBy: props.orderBy,
			select: PrismaService.buildSelectObject(props.select),
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
		return UserMapper.toDomain(updatedUser)
	}
}
