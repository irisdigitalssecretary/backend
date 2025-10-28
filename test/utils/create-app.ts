import 'reflect-metadata'
import { AppModule } from '@/app.module'
import { NestFactory } from '@nestjs/core'
import { env } from '@/core/shared/infra/config/env-validation'

export async function createApp() {
	const app = await NestFactory.create(AppModule, { logger: false })
	await app.init()
	await app.listen(env.PORT, '0.0.0.0')
	const url = await app.getUrl()

	return { app, url }
}
