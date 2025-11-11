import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { z } from 'zod'

export const updateUserSessionStatusSchema = z.object({
	status: z
		.enum(SessionStatus, {
			message: 'Status inválido.',
		})
		.transform((value) => value.trim()),
})

export type UpdateUserSessionStatusBody = z.infer<
	typeof updateUserSessionStatusSchema
>
