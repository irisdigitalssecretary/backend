import 'reflect-metadata'
import { AppModule } from '@/app.module'
import { Test, TestingModule } from '@nestjs/testing'
import * as qs from 'qs'

export async function createApp() {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile()

	const app = moduleFixture.createNestApplication()
	app.getHttpAdapter().getInstance().set('query parser', qs.parse)
	await app.init()
	return app
}
