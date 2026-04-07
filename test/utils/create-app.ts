import 'reflect-metadata'
import { AppModule } from '@/core/shared/modules/app.module'
import { Test, TestingModule } from '@nestjs/testing'
import * as qs from 'qs'
import cookieParser from 'cookie-parser'
import { env } from 'process'

export async function createApp() {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile()

	const app = moduleFixture.createNestApplication()
	app.getHttpAdapter().getInstance().set('query parser', qs.parse)
	app.use(cookieParser())
	app.enableCors({
		origin: env.FRONTEND_URL,
		credentials: true, // Permite o envio de cookies
	})
	await app.init()
	return app
}
