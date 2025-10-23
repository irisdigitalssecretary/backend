import { FindManyOptions } from '@/core/shared/domain/utils/find-many'
import { SessionStatus, UserEntity, UserStatus } from '../entities/user-entity'
import { OffsetPagination } from '@/core/shared/domain/utils/offset-pagination'

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
