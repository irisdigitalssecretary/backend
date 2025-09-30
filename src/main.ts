import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { env } from '@config/env.validation'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	await app.listen(env.PORT)
}

void bootstrap()
