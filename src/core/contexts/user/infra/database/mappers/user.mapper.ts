import { User } from '@prisma/client'
import { UserFactory } from '../../../domain/factories/make-user-entity'
import { UserEntity } from '@/core/contexts/user/domain/entities/user.entity'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'

export class UserMapper {
	static toDomain(user: User): UserEntity {
		return UserFactory.reconstitute(
			{
				id: user.id,
				name: user.name,
				email: user.email,
				sessionStatus:
					SessionStatus[user.sessionStatus?.toUpperCase()] ??
					undefined,
				status: UserStatus[user.status?.toUpperCase()] ?? undefined,
				password: user.password ?? undefined,
				phone: user.phone ?? undefined,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				companyId: user.companyId,
			},
			user.uuid,
		)
	}

	static toPersistence(user: UserEntity) {
		return {
			name: user.name,
			email: user.email,
			password: user.password ?? '',
			phone: user.phone,
			sessionStatus: user.sessionStatus,
			status: user.status,
			companyId: user.companyId,
		}
	}
}
