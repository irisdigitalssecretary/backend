import { User } from '@prisma/client'
import { makeUserEntity } from '../../../factories/make-user-entity'
import { UserEntity } from '@/core/contexts/user/domain/entities/user.entity'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'

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
