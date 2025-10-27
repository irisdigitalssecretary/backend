import 'reflect-metadata'
import { AppModule } from '@/app.module'
import { NestFactory } from '@nestjs/core'

export async function createApp() {
	const app = await NestFactory.create(AppModule, { logger: false })
	await app.init()
	await app.listen(0)
	const url = await app.getUrl()
	return { app, url }
}
