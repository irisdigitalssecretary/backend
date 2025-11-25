import { env } from './src/core/shared/infra/config/env-validation.js'

export default {
	datasource: {
		url: env.DATABASE_URL,
	},
}
