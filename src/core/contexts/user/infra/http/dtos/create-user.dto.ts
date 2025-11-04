import { z } from 'zod'

export const createUserSchema = z.object({
	name: z.string(),
	email: z
		.email('E-mail inválido.')
		.max(100, 'E-mail deve possuir no máximo 100 caracteres.'),
	password: z
		.string()
		.min(8, 'Senha deve possuir no mínimo 8 caracteres.')
		.max(16, 'Senha deve possuir no máximo 16 caracteres.'),
	phone: z
		.string()
		.min(10, 'Telefone deve possuir no mínimo 10 caracteres.')
		.max(16, 'Telefone deve possuir no máximo 16 caracteres.')
		.optional()
		.transform((value) => value?.replace(/[^0-9]/g, '')),
})

export type CreateUserBody = z.infer<typeof createUserSchema>
