import { z } from 'zod'

const selectableFieldsList = [
	'id',
	'uuid',
	'name',
	'email',
	'password',
	'phone',
	'status',
	'sessionStatus',
	'createdAt',
	'updatedAt',
] as const

export const findManyUsersSchema = z.object({
	filters: z
		.object({
			name: z.string().optional(),
			email: z.string().optional(),
			phone: z.string().optional(),
			status: z.string().optional(),
			sessionStatus: z.string().optional(),
		})
		.optional(),
	pagination: z
		.object({
			limit: z.coerce.number().int().positive().default(10),
			page: z.coerce.number().int().positive().default(1),
		})
		.default({ limit: 15, page: 1 }),
	orderBy: z
		.object({
			name: z.enum(['asc', 'desc']).optional(),
			email: z.enum(['asc', 'desc']).optional(),
			status: z.enum(['asc', 'desc']).optional(),
			sessionStatus: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional(),
		})
		.optional(),
	select: z.array(z.enum(selectableFieldsList)).optional(),
})

export type FindManyUsersQuery = z.infer<typeof findManyUsersSchema>
