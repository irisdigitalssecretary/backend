import { FindManyOptions } from '@/core/shared/domain/utils/find-many'
import { UserEntity } from '../entities/user.entity'
import { OffsetPagination } from '@/core/shared/domain/utils/offset-pagination'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'

export interface UserFilters {
	name?: string
	email?: string
	phone?: string
	status?: UserStatus
	sessionStatus?: SessionStatus
}

export abstract class UserRepository {
	public abstract readonly users: UserEntity[]
	abstract create(user: UserEntity): Promise<UserEntity>
	abstract findByEmail(email: string): Promise<UserEntity | null>
	abstract findById(id: number): Promise<UserEntity | null>
	abstract findByUuid(uuid: string): Promise<UserEntity | null>
	abstract update(user: UserEntity): Promise<UserEntity>
	abstract delete(id: number): Promise<void>
	abstract updateSessionStatus(
		id: number,
		sessionStatus: SessionStatus,
	): Promise<UserEntity>
	abstract updateStatus(id: number, status: UserStatus): Promise<UserEntity>
	abstract findManyByOffsetPagination(
		props: FindManyOptions<UserFilters, OffsetPagination>,
	): Promise<UserEntity[]>
}
