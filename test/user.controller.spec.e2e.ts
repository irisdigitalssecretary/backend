import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createApp } from './utils/create-app'

describe('UserController (E2E)', () => {
	let app: INestApplication
	let baseURL: string

	beforeAll(async () => {
		const created = await createApp()
		app = created.app
		baseURL = created.url
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

		const response = await request(baseURL).post('/users').send(newUser)

		console.log({ response, baseURL }, 'boceta')

		expect(response.status).toBe(201)
	})
})
