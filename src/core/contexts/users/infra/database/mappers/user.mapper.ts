import { SessionStatus, User, UserStatus } from 'generated/prisma'
import { makeUserEntity } from '../../../factories/make-user-entity'
import { UserEntity } from '@/core/contexts/users/domain/entities/user-entity'

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
}
