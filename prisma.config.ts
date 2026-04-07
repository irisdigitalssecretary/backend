import { env } from './src/core/shared/infra/config/env-validation.js'

export default {
	schema: './prisma/schema.prisma',
	datasource: {
		url: env.DATABASE_URL,
	},
}
