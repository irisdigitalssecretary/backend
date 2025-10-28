import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { env } from '@shared/infra/config/env-validation'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.listen(env.PORT)
	console.log('server is running on port', env.PORT)
}

void bootstrap()
