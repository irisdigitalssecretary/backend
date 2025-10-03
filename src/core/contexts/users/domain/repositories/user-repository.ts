import { SessionStatus, UserEntity } from '../entities/user-entity'

export abstract class UserRepository {
	public abstract readonly users: UserEntity[]
	abstract create(user: UserEntity): Promise<UserEntity>
	abstract findByEmail(email: string): Promise<UserEntity | null>
	abstract findById(id: string): Promise<UserEntity | null>
	abstract update(user: UserEntity): Promise<UserEntity>
	abstract delete(id: string): Promise<void>
	abstract updateSessionStatus(
		id: string,
		sessionStatus: SessionStatus,
	): Promise<UserEntity>
	abstract inactive(id: string): Promise<void>
	abstract active(id: string): Promise<void>
}
