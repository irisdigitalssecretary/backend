import { z } from 'zod'

export const userSessionSchema = z.object({
    email: z.coerce.string(),
    password: z.coerce.string(),
    companyId: z.coerce.number()
})

export type UserSessionBody = z.infer<typeof userSessionSchema>
