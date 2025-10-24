import { AppModule } from '@/app.module'
import { Test } from '@nestjs/testing'

export async function createApp() {
	const moduleRef = await Test.createTestingModule({
		imports: [AppModule],
	}).compile()

	const app = moduleRef.createNestApplication()
	await app.init()
	return app
}
