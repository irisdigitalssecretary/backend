import { UserFactory } from '@/core/contexts/user/domain/factories/make-user-entity'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'

export const makeUser = async (companyId: number, hasher: Hasher) => {
	return await UserFactory.create(
		{
			name: 'John Doe',
			email: `john.doe${companyId}@example.com`,
			password: 'Test@123',
			sessionStatus: SessionStatus.ONLINE,
			status: UserStatus.ACTIVE,
			companyId: companyId,
		},
		hasher,
	)
}
