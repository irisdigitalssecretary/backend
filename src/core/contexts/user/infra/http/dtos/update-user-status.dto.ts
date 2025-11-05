import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { z } from 'zod'

export const updateUserStatusSchema = z.object({
	status: z.enum(UserStatus, {
		message: 'Status inválido.',
	}),
})

export type UpdateUserStatusBody = z.infer<typeof updateUserStatusSchema>
