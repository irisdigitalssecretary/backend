import { NestFactory } from '@nestjs/core'
import { AppModule } from './core/shared/modules/app.module'
import { env } from '@shared/infra/config/env-validation'
import * as qs from 'qs'
import cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.getHttpAdapter().getInstance().set('query parser', qs.parse)

	app.use(cookieParser())

	app.enableCors({
		origin: env.FRONTEND_URL,
		credentials: true, // Permite o envio de cookies
	})

	await app.listen(env.PORT)
	console.log('server is running on port', env.PORT)
}

void bootstrap()
