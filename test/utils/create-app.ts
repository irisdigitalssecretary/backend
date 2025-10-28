import 'reflect-metadata'
import { AppModule } from '@/app.module'
import { Test, TestingModule } from '@nestjs/testing'

export async function createApp() {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile()

	const app = moduleFixture.createNestApplication()
	await app.init()
	return app
}
