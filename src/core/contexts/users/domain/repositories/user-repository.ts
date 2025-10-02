import { UserEntity } from '../entities/user-entity'

export abstract class UserRepository {
	abstract create(user: UserEntity): Promise<void>
	abstract findByEmail(email: string): Promise<UserEntity | null>
	abstract findById(id: string): Promise<UserEntity | null>
	abstract update(user: UserEntity): Promise<void>
	abstract delete(id: string): Promise<void>
	abstract updateSessionStatus(user: UserEntity): Promise<void>
	abstract inactive(user: UserEntity): Promise<void>
	abstract active(user: UserEntity): Promise<void>
}
