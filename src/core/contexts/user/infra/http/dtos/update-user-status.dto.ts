import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { z } from 'zod'

export const updateUserStatusSchema = z.object({
	status: z
		.enum(UserStatus, {
			message: 'Status inválido.',
		})
		.transform((value) => value.trim() as UserStatus),
})

export type UpdateUserStatusBody = z.infer<typeof updateUserStatusSchema>
