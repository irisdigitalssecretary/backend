import { z } from 'zod'

export const createUserSchema = z.object({
	name: z.string(),
	email: z.email(),
	password: z.string(),
	phone: z.string().optional(),
})

export type CreateUserBody = z.infer<typeof createUserSchema>
