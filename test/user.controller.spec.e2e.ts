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

	it('POST /users -> should not be able to create a user if name is not provided', async () => {
		const newUser = {
			name: '',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)
		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'too_small',
					message: 'Nome é obrigatório.',
					path: ['name'],
				},
			],
		})

		const user = await app.get(PrismaService).user.findMany({})
		expect(user).toHaveLength(0)
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

	it('PUT /users/:id -> should not be able to update a user if name is not provided', async () => {
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
			name: '',
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

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'too_small',
					message: 'Nome é obrigatório.',
					path: ['name'],
				},
			],
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(2)
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

	it('GET /users -> should be able to get many users without parameters (default pagination)', async () => {
		for (let i = 1; i <= 20; i++) {
			await request(server)
				.post('/users')
				.send({
					name: `User ${i}`,
					email: `user${i}@example.com`,
					password: 'Test123@email',
					phone: `12345678${i.toString().padStart(2, '0')}`,
				})
		}

		const response = await request(server).get('/users')

		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(15)
		expect(response.body.users[0]).toMatchObject({
			id: expect.any(Number),
			uuid: expect.any(String),
			name: expect.any(String),
			email: expect.any(String),
			phone: expect.any(String),
			status: expect.any(String),
			sessionStatus: expect.any(String),
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		})
	})

	it('GET /users -> should be able to get many users with custom pagination', async () => {
		for (let i = 1; i <= 20; i++) {
			await request(server)
				.post('/users')
				.send({
					name: `User ${i}`,
					email: `user${i}@example.com`,
					password: 'Test123@email',
				})
		}

		const response = await request(server).get(
			'/users?pagination[limit]=5&pagination[page]=1',
		)

		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(5)
	})

	it('GET /users -> should respect max limit of 70', async () => {
		for (let i = 1; i <= 80; i++) {
			await request(server)
				.post('/users')
				.send({
					name: `User ${i}`,
					email: `user${i}@example.com`,
					password: 'Test123@email',
				})
		}

		const response = await request(server).get(
			'/users?pagination[limit]=100',
		)

		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(70) // Max limit
	})

	it('GET /users -> should be able to filter users by name', async () => {
		await request(server).post('/users').send({
			name: 'Alice Silva',
			email: 'alice.silva.test@example.com',
			password: 'Test123@email',
		})

		await request(server).post('/users').send({
			name: 'Bruno Santos',
			email: 'bruno.santos.test@example.com',
			password: 'Test123@email',
		})

		await request(server).post('/users').send({
			name: 'Alice Costa',
			email: 'alice.costa.test@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get('/users?filters[name]=Alice')

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(2)
		response.body.users.forEach((user: any) => {
			expect(user.name).toContain('Alice')
		})
	})

	it('GET /users -> should be able to filter users by email', async () => {
		await request(server).post('/users').send({
			name: 'Test User 1',
			email: 'uniquetest1@example.com',
			password: 'Test123@email',
		})

		await request(server).post('/users').send({
			name: 'Test User 2',
			email: 'uniquetest2@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get(
			'/users?filters[email]=uniquetest1',
		)

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(1)
		expect(response.body.users[0].email).toContain('uniquetest1')
	})

	it('GET /users -> should be able to filter users by phone', async () => {
		await request(server).post('/users').send({
			name: 'Test User Phone 1',
			email: 'testphone1@example.com',
			password: 'Test123@email',
			phone: '11999887766',
		})

		await request(server).post('/users').send({
			name: 'Test User Phone 2',
			email: 'testphone2@example.com',
			password: 'Test123@email',
			phone: '11888776655',
		})

		const response = await request(server).get(
			'/users?filters[phone]=11999887766',
		)

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(1)
		const foundUser = response.body.users.find(
			(user: any) => user.phone === '11999887766',
		)
		expect(foundUser).toBeDefined()
		expect(foundUser.phone).toBe('11999887766')
	})

	it('GET /users -> should be able to filter users by status', async () => {
		await request(server).post('/users').send({
			name: 'Active User Test',
			email: 'activetest@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get(
			'/users?filters[status]=active',
		)

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(1)
		const activeUsers = response.body.users.filter(
			(user: any) => user.status === 'active',
		)
		expect(activeUsers.length).toBe(response.body.users.length)
	})

	it('GET /users -> should be able to filter users by sessionStatus', async () => {
		await request(server).post('/users').send({
			name: 'User Session Test',
			email: 'usersessiontest@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get(
			'/users?filters[sessionStatus]=offline',
		)

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(1)
		const offlineUsers = response.body.users.filter(
			(user: any) => user.sessionStatus === 'offline',
		)
		expect(offlineUsers.length).toBe(response.body.users.length)
	})

	it('GET /users -> should be able to combine multiple filters', async () => {
		await request(server).post('/users').send({
			name: 'Alice Silva MultiFilter',
			email: 'alice.multifilter@example.com',
			password: 'Test123@email',
		})

		await request(server).post('/users').send({
			name: 'Bob MultiFilter',
			email: 'bob.multifilter@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get(
			'/users?filters[name]=Alice&filters[status]=active',
		)

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(1)
		response.body.users.forEach((user: any) => {
			expect(user.name).toContain('Alice')
			expect(user.status).toBe('active')
		})
	})

	it('GET /users -> should be able to order users by name ascending', async () => {
		await request(server).post('/users').send({
			name: 'Zebra Order Test',
			email: 'zebra.order@example.com',
			password: 'Test123@email',
		})

		await request(server).post('/users').send({
			name: 'Alpha Order Test',
			email: 'alpha.order@example.com',
			password: 'Test123@email',
		})

		await request(server).post('/users').send({
			name: 'Beta Order Test',
			email: 'beta.order@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get(
			'/users?orderBy[name]=asc&pagination[limit]=10',
		)

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(3)

		const names = response.body.users.map(
			(user: any) => user.name as string,
		)
		for (let i = 1; i < names.length; i++) {
			expect(names[i - 1].localeCompare(names[i])).toBeLessThanOrEqual(0)
		}
	})

	it('GET /users -> should be able to order users by name descending', async () => {
		await request(server).post('/users').send({
			name: 'Alice',
			email: 'alice@example.com',
			password: 'Test123@email',
		})

		await request(server).post('/users').send({
			name: 'Bob',
			email: 'bob@example.com',
			password: 'Test123@email',
		})

		await request(server).post('/users').send({
			name: 'Charlie',
			email: 'charlie@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get('/users?orderBy[name]=desc')

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(3)

		// Verificar se está ordenado decrescente
		const names = response.body.users.map(
			(user: any) => user.name as string,
		)
		const sortedNames = [...names].sort().reverse()
		expect(names).toEqual(sortedNames)
	})

	it('GET /users -> should be able to order users by email', async () => {
		await request(server).post('/users').send({
			name: 'User Email 1',
			email: 'zzz.email.order@example.com',
			password: 'Test123@email',
		})

		await request(server).post('/users').send({
			name: 'User Email 2',
			email: 'aaa.email.order@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get(
			'/users?orderBy[email]=asc&pagination[limit]=10',
		)

		expect(response.status).toBe(200)
		const emails = response.body.users.map(
			(user: any) => user.email as string,
		)
		for (let i = 1; i < emails.length; i++) {
			expect(emails[i - 1].localeCompare(emails[i])).toBeLessThanOrEqual(
				0,
			)
		}
	})

	it('GET /users -> should be able to select specific fields', async () => {
		await request(server).post('/users').send({
			name: 'John Doe Select Test',
			email: 'john.select@example.com',
			password: 'Test123@email',
			phone: '11999887766',
		})

		const response = await request(server).get('/users?pagination[limit]=5')

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(1)

		response.body.users.forEach((user: any) => {
			expect(user.name).toBeDefined()
			expect(user.email).toBeDefined()
		})
	})

	it('GET /users -> should be able to get users with all fields', async () => {
		await request(server).post('/users').send({
			name: 'Test User All Fields',
			email: 'test.allfields@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get('/users?pagination[limit]=5')

		expect(response.status).toBe(200)
		expect(response.body.users.length).toBeGreaterThanOrEqual(1)

		response.body.users.forEach((user: any) => {
			expect(user.id).toBeDefined()
			expect(user.uuid).toBeDefined()
		})
	})

	it('GET /users -> should be able to combine filters, pagination, ordering and select', async () => {
		for (let i = 1; i <= 10; i++) {
			await request(server)
				.post('/users')
				.send({
					name: `Alice User ${i}`,
					email: `alice${i}@example.com`,
					password: 'Test123@email',
				})
		}

		for (let i = 1; i <= 5; i++) {
			await request(server)
				.post('/users')
				.send({
					name: `Bob User ${i}`,
					email: `bob${i}@example.com`,
					password: 'Test123@email',
				})
		}

		const response = await request(server).get(
			'/users?filters[name]=Alice&pagination[limit]=5&pagination[page]=1&orderBy[name]=asc&select=name&select=email',
		)

		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(5)

		response.body.users.forEach((user: any) => {
			expect(user.name).toContain('Alice')
			expect(user.email).toBeDefined()
		})

		// Verificar ordenação
		const names = response.body.users.map(
			(user: any) => user.name as string,
		)
		const sortedNames = [...names].sort()
		expect(names).toEqual(sortedNames)
	})

	it('GET /users -> should return empty array when no users match filters', async () => {
		await request(server).post('/users').send({
			name: 'John Doe Empty Test',
			email: 'john.emptytest@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get(
			'/users?filters[name]=NonExistentUserXYZ12345',
		)

		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(0)
	})

	it('GET /users -> should return empty array when page exceeds total records', async () => {
		await request(server).post('/users').send({
			name: 'Test User Page',
			email: 'test.page@example.com',
			password: 'Test123@email',
		})

		const response = await request(server).get(
			'/users?pagination[limit]=5&pagination[page]=1000',
		)

		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(0)
	})

	it('GET /users -> should handle pagination correctly across pages', async () => {
		for (let i = 1; i <= 25; i++) {
			await request(server)
				.post('/users')
				.send({
					name: `User Pagination ${i}`,
					email: `user.pagination${i}@example.com`,
					password: 'Test123@email',
				})
		}

		const firstPage = await request(server).get(
			'/users?filters[name]=Pagination&pagination[limit]=5&pagination[page]=1&orderBy[email]=asc',
		)
		const secondPage = await request(server).get(
			'/users?filters[name]=Pagination&pagination[limit]=5&pagination[page]=2&orderBy[email]=asc',
		)

		expect(firstPage.status).toBe(200)
		expect(secondPage.status).toBe(200)

		expect(firstPage.body.users.length).toBeGreaterThanOrEqual(5)
		expect(secondPage.body.users.length).toBeGreaterThanOrEqual(5)

		const firstPageIds = firstPage.body.users.map(
			(user: any) => user.id as number,
		)
		const secondPageIds = secondPage.body.users.map(
			(user: any) => user.id as number,
		)

		const intersection = firstPageIds.filter((id: number) =>
			Boolean(secondPageIds.includes(id)),
		)
		expect(intersection).toHaveLength(0)
	})
})
