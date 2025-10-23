import { User } from '@prisma/client'
import { makeUserEntity } from '../../../factories/make-user-entity'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '@/core/contexts/user/domain/entities/user-entity'

export class UserMapper {
	static async toDomain(user: User): Promise<UserEntity> {
		return await makeUserEntity({
			id: user.id,
			name: user.name,
			email: user.email,
			sessionStatus: SessionStatus[user.sessionStatus.toUpperCase()],
			status: UserStatus[user.status.toUpperCase()],
			phone: user.phone || undefined,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})
	}

	static toPersistence(user: UserEntity) {
		return {
			name: user.name,
			email: user.email,
			password: user.password,
			phone: user.phone,
			sessionStatus: user.sessionStatus,
			status: user.status,
		}
	}
}
