import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createApp } from './utils/create-app'

describe('UserController (E2E)', () => {
	let app: INestApplication
	let server: any

	beforeAll(async () => {
		app = await createApp()
		server = app.getHttpServer()
	})

	afterAll(async () => {
		await app.close()
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
