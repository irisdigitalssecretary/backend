import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createApp } from './utils/create-app'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'

describe('UserController (E2E)', () => {
	let app: INestApplication
	let server: any
	let prismaService: PrismaService

	beforeAll(async () => {
		app = await createApp()
		console.log(app, 'buceta')
		server = app.getHttpServer()
		prismaService = app.get(PrismaService)
	})

	afterAll(async () => {
		await app.close()
	})

	beforeEach(async () => {
		await prismaService.cleanDatabase()
	})

	it('POST /users -> should be able to create a new user', async () => {
		const newUser = {
			name: 'João Vitor Machado Rorato',
			email: 'joaovitormachadororato@gmail.com',
			password: 'Test123@gmaiiil',
			phone: '5547988950332',
		}

		const response = await request(server)
			.post('/users')
			.send(newUser)
			.expect(201)
	})
})
