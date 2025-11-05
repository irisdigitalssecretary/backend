import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { z } from 'zod'

export const updateUserSchema = z.object({
	name: z.string(),
	sessionStatus: z.enum(SessionStatus, {
		message: 'Status de sessão inválido.',
	}),
	status: z.enum(UserStatus, {
		message: 'Status inválido.',
	}),
	email: z
		.email('E-mail inválido.')
		.max(100, 'E-mail deve possuir no máximo 100 caracteres.'),
	oldPassword: z.string().optional(),
	password: z
		.string()
		.min(8, 'Senha deve possuir no mínimo 8 caracteres.')
		.max(16, 'Senha deve possuir no máximo 16 caracteres.')
		.optional(),
	phone: z
		.string()
		.min(10, 'Telefone deve possuir no mínimo 10 caracteres.')
		.max(16, 'Telefone deve possuir no máximo 16 caracteres.')
		.optional()
		.transform((value) => value?.replace(/[^0-9]/g, '')),
})

export type UpdateUserBody = z.infer<typeof updateUserSchema>
