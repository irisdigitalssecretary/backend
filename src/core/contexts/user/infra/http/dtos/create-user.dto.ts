import { z } from 'zod'

export const createUserSchema = z.object({
	name: z.string(),
	email: z.email('E-mail inválido.'),
	password: z.string(),
	phone: z
		.string()
		.min(10, 'Telefone deve possuir no mínimo 10 caracteres.')
		.max(16, 'Telefone deve possuir no máximo 16 caracteres.')
		.optional()
		.transform((value) => value?.replace(/[^0-9]/g, '')),
})

export type CreateUserBody = z.infer<typeof createUserSchema>
