import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { env } from '@shared/infra/config/env.validation'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	await app.listen(env.PORT)
}

void bootstrap()
