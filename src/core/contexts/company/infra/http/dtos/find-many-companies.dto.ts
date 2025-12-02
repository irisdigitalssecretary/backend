import { z } from 'zod'

export const selectableFieldsList = [
	'id',
	'uuid',
	'name',
	'email',
	'taxId',
	'landline',
	'phone',
	'address',
	'city',
	'state',
	'businessArea',
	'personType',
	'countryCode',
	'countryId',
	'zip',
	'description',
	'status',
	'createdAt',
	'updatedAt',
] as const

export const findManyCompaniesSchema = z.object({
	filters: z
		.object({
			id: z.coerce.number().optional(),
			uuid: z.string().optional(),
			name: z.string().optional(),
			email: z.string().optional(),
			taxId: z.string().optional(),
			landline: z.string().optional(),
			phone: z.string().optional(),
			address: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			businessArea: z.string().optional(),
			personType: z.string().optional(),
			countryCode: z.string().optional(),
			countryId: z.coerce.number().optional(),
			zip: z.string().optional(),
			description: z.string().optional(),
			status: z.string().optional(),
			createdAt: z
				.string()
				.transform((val) => new Date(val))
				.optional(),
			updatedAt: z
				.string()
				.transform((val) => new Date(val))
				.optional(),
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
			id: z.enum(['asc', 'desc']).optional(),
			uuid: z.enum(['asc', 'desc']).optional(),
			name: z.enum(['asc', 'desc']).optional(),
			email: z.enum(['asc', 'desc']).optional(),
			taxId: z.enum(['asc', 'desc']).optional(),
			landline: z.enum(['asc', 'desc']).optional(),
			phone: z.enum(['asc', 'desc']).optional(),
			address: z.enum(['asc', 'desc']).optional(),
			city: z.enum(['asc', 'desc']).optional(),
			state: z.enum(['asc', 'desc']).optional(),
			businessArea: z.enum(['asc', 'desc']).optional(),
			personType: z.enum(['asc', 'desc']).optional(),
			countryCode: z.enum(['asc', 'desc']).optional(),
			countryId: z.enum(['asc', 'desc']).optional(),
			zip: z.enum(['asc', 'desc']).optional(),
			description: z.enum(['asc', 'desc']).optional(),
			status: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional(),
		})
		.optional(),
	select: z.array(z.enum(selectableFieldsList)).optional(),
})

export type FindManyCompaniesQuery = z.infer<typeof findManyCompaniesSchema>
