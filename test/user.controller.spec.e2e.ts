import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createApp } from './utils/create-app'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'

describe('UserController (E2E)', () => {
	let app: INestApplication
	let server: any

	beforeAll(async () => {
		app = await createApp()
		server = app.getHttpServer()
	})

	beforeEach(async () => {
		await app.get(PrismaService).cleanDatabase()
	})

	afterAll(async () => {
		await app.close()
	})

	it('POST /users -> should be able to create a new user', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(201)
		expect(response.body).toMatchObject({
			user: {
				id: expect.any(Number),
				uuid: expect.any(String),
				name: newUser.name,
				email: newUser.email,
				phone: newUser.phone.replace(/[^0-9]/g, ''),
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		})
	})

	it('POST /users -> should not be able to create a new user with phone number less than 10 characters', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '+123456789',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			message: 'Telefone deve possuir no mínimo 10 caracteres.',
		})
	})

	it('POST /users -> should not be able to create a new user with phone number greater than 16 characters', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '+12345678901234567',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'too_big',
					message: 'Telefone deve possuir no máximo 16 caracteres.',
					path: ['phone'],
				},
			],
		})
	})

	it('POST /users -> should not be able to create a new user with invalid email', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe',
			password: 'Test123@emaiiil',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			message: 'E-mail inválido.',
		})
	})
})
