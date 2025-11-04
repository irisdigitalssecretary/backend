import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createApp } from './utils/create-app'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'

describe('UserController.create (E2E)', () => {
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

	it('POST /users -> should be able to create a user', async () => {
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
				status: 'active',
				sessionStatus: 'offline',
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		})

		const user = await app.get(PrismaService).user.findFirst({})
		expect(user).toMatchObject({
			id: expect.any(Number),
			uuid: expect.any(String),
			name: newUser.name,
			email: newUser.email,
			phone: newUser.phone.replace(/[^0-9]/g, ''),
			status: 'active',
			sessionStatus: 'offline',
		})
	})

	it('POST /users -> should not be able to create a user with an email that already exists', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '+1234567890',
		}

		await app.get(PrismaService).user.create({
			data: {
				name: newUser.name,
				email: newUser.email,
				password: newUser.password,
				phone: newUser.phone,
			},
		})

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(409)
		expect(response.body).toMatchObject({
			message: 'Já existe um usuário com este email cadastrado',
			statusCode: 409,
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(1)
	})

	it('POST /users -> should not be able to create a user with an invalid email', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe',
			password: 'Test123@emaiiil',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'invalid_format',
					message: 'E-mail inválido.',
					path: ['email'],
				},
			],
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(0)
	})

	it('POST /users -> should not be able to create a user with an email longer than 100 characters', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'a'.repeat(90) + '@example.com',
			password: 'Test123@emaiiil',
			phone: '+1234567890',
		}
		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'too_big',
					message: 'E-mail deve possuir no máximo 100 caracteres.',
					path: ['email'],
				},
			],
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(0)
	})

	it('POST /users -> should not be able to create a user with a password with less than 8 characters', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'A@bcd1',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'too_small',
					message: 'Senha deve possuir no mínimo 8 caracteres.',
					path: ['password'],
				},
			],
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(0)
	})

	it('POST /users -> should not be able to create a user with a password longer than 16 characters', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'A@bcd123456789101112131456',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'too_big',
					message: 'Senha deve possuir no máximo 16 caracteres.',
					path: ['password'],
				},
			],
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(0)
	})

	it('POST /users -> should not be able to create a user with a password without uppercase letter', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'a@bcdef123',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			message: 'Senha deve possuir pelo menos uma letra maiúscula.',
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(0)
	})

	it('POST /users -> should not be able to create a user with a password without number', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'A@bcdeifgh',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			message: 'Senha deve possuir pelo menos um número.',
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(0)
	})

	it('POST /users -> should not be able to create a user with a password without special character', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Abcdefgh1234',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			message: 'Senha deve possuir pelo menos um caractere especial.',
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(0)
	})

	it('POST /users -> should not be able to create a user with a phone number longer than 16 characters', async () => {
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

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(0)
	})

	it('POST /users -> should not be able to create a user with a phone number less than 10 characters', async () => {
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

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(0)
	})

	it('PUT /users/:id -> should be able to update a user', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await app.get(PrismaService).user.create({
			data: newUser,
		})

		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 2',
			email: 'john.doe2@example.com',
			password: 'Test@1234',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(201)
		expect(response.body).toMatchObject({
			user: {
				id: expect.any(Number),
				uuid: expect.any(String),
			},
		})
	})
})
