import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { env } from '@shared/infra/config/env-validation'
import * as qs from 'qs'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.getHttpAdapter().getInstance().set('query parser', qs.parse)
	await app.listen(env.PORT)
	console.log('server is running on port', env.PORT)
}

void bootstrap()
