import { z } from 'zod'
import { config } from 'dotenv'

config({ path: '.env.test' })

export const envSchema = z.object({
	// Aplicação
	PORT: z.coerce.number().default(3000),

	// PostgreSQL
	POSTGRES_HOST: z.string().default('localhost'),
	POSTGRES_USER: z.string().default('postgres'),
	POSTGRES_PASSWORD: z.string(),
	POSTGRES_DB: z.string(),
	POSTGRES_PORT: z.coerce.number().default(5432),
	DATABASE_URL: z.url(),

	// MongoDB
	MONGO_HOST: z.string().default('localhost'),
	MONGO_USER: z.string(),
	MONGO_PASSWORD: z.string(),
	MONGO_DB: z.string(),
	MONGO_PORT: z.coerce.number().default(27017),
	MONGO_URI: z.string().optional(),

	// Redis
	REDIS_HOST: z.string().default('localhost'),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_PASSWORD: z.string(),

	//App
	APP_ENV: z.string().default('development'),
})

export const env = envSchema.parse(process.env)

export type EnvSchema = z.infer<typeof envSchema>
