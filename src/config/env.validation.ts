import { z } from 'zod'
import { config } from 'dotenv'

config()

export const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
})

export const env = envSchema.parse(process.env)

export type EnvSchema = z.infer<typeof envSchema>
