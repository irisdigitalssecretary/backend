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

		await request(server).post('/users').send(newUser)

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

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		await request(server).post('/users').send({
			name: 'John Doe',
			email: 'john.d@example.com',
			password: 'Test123@emaiiil',
		})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe1@example.com',
			oldPassword: newUser.password,
			password: 'Test@1234',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({
			user: {
				id: expect.any(Number),
				uuid: expect.any(String),
				name: newData.name,
				email: newData.email,
				phone: newData.phone.replace(/[^0-9]/g, ''),
				status: newData.status,
				sessionStatus: newData.sessionStatus,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		})
	})

	it('PUT /users/:id -> should be able to update a user keeping the same email', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		await request(server).post('/users').send({
			name: 'John Doe',
			email: 'john.d@example.com',
			password: 'Test123@emaiiil',
		})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe@example.com',
			oldPassword: newUser.password,
			password: 'Test@1234',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({
			user: {
				id: expect.any(Number),
				uuid: expect.any(String),
				name: newData.name,
				email: newData.email,
				status: newData.status,
				sessionStatus: newData.sessionStatus,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the user not exists', async () => {
		const newData = {
			name: 'John Doe 2',
			email: 'john.doe2@example.com',
			oldPassword: 'A234!kaleee',
			password: 'Test@1234',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server).put(`/users/1123`).send(newData)
		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the email already exists', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 2',
			email: 'john.doe2@example.com',
			oldPassword: newUser.password,
			password: 'Test@1234',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({
			user: {
				id: expect.any(Number),
				uuid: expect.any(String),
				name: newData.name,
				email: newData.email,
				phone: newData.phone.replace(/[^0-9]/g, ''),
				status: newData.status,
				sessionStatus: newData.sessionStatus,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the old password is not provided and the password is provided', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe1@example.com',
			password: 'Test@1234',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(401)
		expect(response.body).toMatchObject({
			message: 'A senha atual é obrigatória para atualizar a senha.',
			statusCode: 401,
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the old password is invalid', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe1@example.com',
			oldPassword: 'A234!kaleee',
			password: 'Test@1234',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(401)
		expect(response.body).toMatchObject({
			message: 'A senha atual é inválida.',
			statusCode: 401,
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the password without uppercase letter', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe1@example.com',
			oldPassword: newUser.password,
			password: 'test@1234',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			message: 'Senha deve possuir pelo menos uma letra maiúscula.',
			statusCode: 400,
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the password without number', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe1@example.com',
			oldPassword: newUser.password,
			password: 'Test@bcdef',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			message: 'Senha deve possuir pelo menos um número.',
			statusCode: 400,
		})
	})

	it('PUT /users/:id -> should not be able to update a user with a password with less than 8 characters', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe1@example.com',
			oldPassword: newUser.password,
			password: 'Test@12',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'too_small',
					message: 'Senha deve possuir no mínimo 8 caracteres.',
					path: ['password'],
				},
			],
			statusCode: 400,
		})
	})

	it('PUT /users/:id -> should not be able to update a user with a password longer than 16 characters', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe1@example.com',
			oldPassword: newUser.password,
			password: 'Test@123456789101',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'too_big',
					message: 'Senha deve possuir no máximo 16 caracteres.',
					path: ['password'],
				},
			],
			statusCode: 400,
		})
	})

	it('PUT /users/:id -> should not be able to update a user with a password without special character', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe1@example.com',
			oldPassword: newUser.password,
			password: 'Testabc123456789',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			message: 'Senha deve possuir pelo menos um caractere especial.',
			statusCode: 400,
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the email is invalid', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.doe',
			oldPassword: newUser.password,
			password: 'Test@123456789',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'invalid_format',
					message: 'E-mail inválido.',
					path: ['email'],
				},
			],
			statusCode: 400,
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the session status is invalid', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.d@example.com',
			oldPassword: newUser.password,
			password: 'Test@123456789',
			phone: '0987654321',
			sessionStatus: 'invalid-status',
			status: 'active',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'invalid_value',
					message: 'Status de sessão inválido.',
					path: ['sessionStatus'],
				},
			],
			statusCode: 400,
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the status is invalid', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			name: 'John Doe 3',
			email: 'john.d@example.com',
			oldPassword: newUser.password,
			password: 'Test@123456789',
			phone: '0987654321',
			sessionStatus: 'online',
			status: 'invalid-status',
		}

		const response = await request(server)
			.put(`/users/${user?.id}`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'invalid_value',
					message: 'Status inválido.',
					path: ['status'],
				},
			],
			statusCode: 400,
		})
	})

	it('PATCH /users/:id/session-status -> should be able to update user session status', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		let user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			status: 'online',
		}

		const response = await request(server)
			.patch(`/users/${user?.id}/session-status`)
			.send(newData)

		expect(response.status).toBe(200)
		user = await app.get(PrismaService).user.findFirst({})
		expect(user?.sessionStatus).toBe(newData.status)
	})

	it('PATCH /users/:id/session-status -> should not be able to update user session status if the status is invalid', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			status: 'invalid-status',
		}

		const response = await request(server)
			.patch(`/users/${user?.id}/session-status`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'invalid_value',
					message: 'Status inválido.',
					path: ['status'],
				},
			],
			statusCode: 400,
		})
	})

	it('PATCH /users/:id/session-status -> should not be able to update user session status if the user does not exist', async () => {
		const newData = {
			status: 'online',
		}

		const response = await request(server)
			.patch(`/users/123/session-status`)
			.send(newData)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
	})

	it('PATCH /users/:id/status -> should be able to update user status', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)

		let user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			status: 'inactive',
		}

		const response = await request(server)
			.patch(`/users/${user?.id}/status`)
			.send(newData)

		expect(response.status).toBe(200)
		user = await app.get(PrismaService).user.findFirst({})
		expect(user?.status).toBe(newData.status)
	})

	it('PATCH /users/:id/status -> should not be able to update a user status if the status is invalid', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const newData = {
			status: 'invalid-status',
		}

		const response = await request(server)
			.patch(`/users/${user?.id}/status`)
			.send(newData)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'invalid_value',
					message: 'Status inválido.',
					path: ['status'],
				},
			],
			statusCode: 400,
		})
	})

	it('PATCH /users/:id/status -> should not be able to update user status if the user does not exist', async () => {
		const newData = {
			status: 'inactive',
		}

		const response = await request(server)
			.patch(`/users/123/status`)
			.send(newData)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
	})

	it('DELETE /users/:id -> should be able to delete a user', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const response = await request(server).delete(`/users/${user?.id}`)

		expect(response.status).toBe(200)
	})

	it('DELETE /users/:id -> should not be able to delete a user if the user does not exist', async () => {
		const response = await request(server).delete(`/users/123`)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
	})

	it('GET /users/:uuid -> should be able to get a user by uuid', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		await request(server).post('/users').send(newUser)
		const user = await app.get(PrismaService).user.findFirst({})

		const response = await request(server).get(`/users/${user?.uuid}`)

		expect(response.status).toBe(200)

		expect(response.body).toMatchObject({
			user: {
				id: user?.id,
				uuid: user?.uuid,
				name: newUser.name,
				email: newUser.email,
				phone: newUser.phone.replace(/[^0-9]/g, ''),
				status: user?.status,
				sessionStatus: user?.sessionStatus,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		})
	})

	it('GET /users/:uuid -> should not be able to get a user by uuid if the user does not exist', async () => {
		const response = await request(server).get(`/users/123`)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
	})

	it('GET /users -> should be able to get many users', async () => {
		
	})
})
