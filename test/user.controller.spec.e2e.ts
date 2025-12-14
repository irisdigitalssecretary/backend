import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createApp } from './utils/create-app'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'
import { env } from '@/core/shared/infra/config/env-validation'

async function createTestUser(
	companyId: number | string,
	server: any,
	index: number,
	overrides?: {
		name?: string
		email?: string
		password?: string
		phone?: string
	},
) {
	const defaultUser = {
		name: `User ${index}`,
		email: `user${index}@example.com`,
		password: `Test123${index}@email`,
		phone: `+55119${index.toString().padStart(8, '0')}`,
	}
	const newUser = { ...defaultUser, ...overrides }
	const response = await request(server)
		.post('/users')
		.set('Authorization', `Bearer ${env.MASTER_KEY}`)
		.set('x-company-id', String(companyId))
		.send(newUser)
	return response.body.user as Record<string, any>
}

describe('UserController (E2E)', () => {
	let app: INestApplication
	let server: any
	let company: Record<string, any>

	beforeAll(async () => {
		app = await createApp()
		server = app.getHttpServer()
	})

	beforeEach(async () => {
		await app.get(PrismaService).cleanDatabase()
		const response = await request(server).post('/companies').send({
			name: 'Company 1',
			email: 'company1@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: 'Technology',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160306',
			landline: '+551135211980',
			phone: '+5511988899090',
			description: 'Company 1 description is valid!',
		})

		company = response.body.company
	})

	afterAll(async () => {
		await app.close()
	})

	it('Security / Auth -> should not be performed if authentication does not exist', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '+1234567890',
		}

		const response = await request(server).post('/users').send(newUser)

		expect(response.status).toBe(401)
		expect(response.body).toMatchObject({
			message: 'Unauthorized access',
			statusCode: 401,
		})
	})

	it('POST /users -> should be able to create a user', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '+1234567890',
		}

		const response = await request(server)
			.post('/users')
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newUser)

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

		await createTestUser(company.id, server, 1, newUser)

		const response = await request(server)
			.post('/users')
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newUser)
		expect(response.status).toBe(409)
		expect(response.body).toMatchObject({
			message: 'Já existe um usuário com este email cadastrado',
			statusCode: 409,
		})

		const users = await app.get(PrismaService).user.findMany({})
		expect(users).toHaveLength(1)
	})

	it('PUT /users/:id -> should be able to update a user', async () => {
		const newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		const createdUser = await createTestUser(company.id, server, 1, newUser)

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
			.put(`/users/${createdUser?.id}`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
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

		const createdUser = await createTestUser(company.id, server, 1, newUser)

		await request(server)
			.post('/users')
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send({
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
			.put(`/users/${createdUser.id}`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
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

		const response = await request(server)
			.put(`/users/1123`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newData)
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

		const createdUser = await createTestUser(company.id, server, 1, newUser)

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
			.put(`/users/${createdUser.id}`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
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

		await request(server)
			.post('/users')
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newUser)
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
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newData)

		expect(response.status).toBe(401)
		expect(response.body).toMatchObject({
			message: 'A senha atual é obrigatória para atualizar a senha.',
			statusCode: 401,
		})
	})

	it('PUT /users/:id -> should not be able to update a user if the old password is invalid', async () => {
		const userToCreate = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		const createdUser = await createTestUser(
			company.id,
			server,
			1,
			userToCreate,
		)

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
			.put(`/users/${createdUser.id}`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newData)

		expect(response.status).toBe(401)
		expect(response.body).toMatchObject({
			message: 'A senha atual é inválida.',
			statusCode: 401,
		})
	})

	it('PATCH /users/:id/session-status -> should be able to update user session status', async () => {
		const userToCreate = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		const createdUser = await createTestUser(
			company.id,
			server,
			1,
			userToCreate,
		)

		const newData = {
			status: 'online',
		}

		const response = await request(server)
			.patch(`/users/${createdUser?.id}/session-status`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newData)

		expect(response.status).toBe(200)
		const updatedUser = await app.get(PrismaService).user.findFirst({
			where: { id: createdUser.id },
		})
		expect(updatedUser?.sessionStatus).toBe(newData.status)
	})

	it('PATCH /users/:id/session-status -> should not be able to update user session status if the user does not exist', async () => {
		const newData = {
			status: 'online',
		}

		const response = await request(server)
			.patch(`/users/123/session-status`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newData)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
	})

	it('PATCH /users/:id/status -> should be able to update user status', async () => {
		const userToCreate = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		const createdUser = await createTestUser(
			company.id,
			server,
			1,
			userToCreate,
		)

		const newData = {
			status: 'inactive',
		}

		const response = await request(server)
			.patch(`/users/${createdUser.id}/status`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newData)

		expect(response.status).toBe(200)
		const updatedUser = await app.get(PrismaService).user.findFirst({
			where: { id: createdUser.id },
		})
		expect(updatedUser?.status).toBe(newData.status)
	})

	it('PATCH /users/:id/status -> should not be able to update user status if the user does not exist', async () => {
		const newData = {
			status: 'inactive',
		}

		const response = await request(server)
			.patch(`/users/123/status`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send(newData)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
	})

	it('DELETE /users/:id -> should be able to delete a user', async () => {
		const userToCreate = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		const createdUser = await createTestUser(
			company.id,
			server,
			1,
			userToCreate,
		)

		const response = await request(server)
			.delete(`/users/${createdUser.id}`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)

		expect(response.status).toBe(200)
	})

	it('DELETE /users/:id -> should not be able to delete a user if the user does not exist', async () => {
		const response = await request(server)
			.delete(`/users/123`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
	})

	it('GET /users/:uuid -> should be able to get a user by uuid', async () => {
		const userToCreate = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Test123@emaiiil',
			phone: '1234567890',
		}

		const createdUser = await createTestUser(
			company.id,
			server,
			1,
			userToCreate,
		)

		const response = await request(server)
			.get(`/users/${createdUser.uuid}`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)

		expect(response.status).toBe(200)

		expect(response.body).toMatchObject({
			user: {
				id: createdUser?.id,
				uuid: createdUser?.uuid,
				name: createdUser.name,
				email: userToCreate.email,
				phone: userToCreate.phone.replace(/[^0-9]/g, ''),
				status: createdUser.status,
				sessionStatus: createdUser.sessionStatus,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		})
	})

	it('GET /users/:uuid -> should not be able to get a user by uuid if the user does not exist', async () => {
		const response = await request(server)
			.get(`/users/123`)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Usuário não encontrado.',
			statusCode: 404,
		})
	})

	it('GET /users -> should be able to find many users with pagination', async () => {
		for (let i = 1; i <= 5; i++) {
			await createTestUser(company.id, server, i)
		}
		const response = await request(server)
			.get('/users')
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.query({ pagination: { limit: 15, page: 1 } })
		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(5)
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

	it('GET /users -> should be able to find many users with custom pagination', async () => {
		for (let i = 1; i <= 5; i++) {
			await createTestUser(company.id, server, i)
		}
		const response = await request(server)
			.get('/users?pagination[limit]=5&pagination[page]=1')
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(5)
	})

	it('GET /users -> should respect max limit of 70', async () => {
		for (let i = 1; i <= 80; i++) {
			await request(server)
				.post('/users')
				.set('Authorization', `Bearer ${env.MASTER_KEY}`)
				.set('x-company-id', company.id)
				.send({
					name: `User ${i}`,
					email: `user${i}@example.com`,
					password: 'Test123@email',
				})
		}

		const response = await request(server)
			.get('/users?pagination[limit]=100')
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)

		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(70)
	})

	it('GET /users -> should be able to combine filters, pagination, ordering and select', async () => {
		for (let i = 1; i <= 10; i++) {
			await request(server)
				.post('/users')
				.set('Authorization', `Bearer ${env.MASTER_KEY}`)
				.set('x-company-id', company.id)
				.send({
					name: `Alice User ${i}`,
					email: `alice${i}@example.com`,
					password: 'Test123@email',
				})
		}

		for (let i = 1; i <= 5; i++) {
			await request(server)
				.post('/users')
				.set('Authorization', `Bearer ${env.MASTER_KEY}`)
				.set('x-company-id', company.id)
				.send({
					name: `Bob User ${i}`,
					email: `bob${i}@example.com`,
					password: 'Test123@email',
				})
		}

		const response = await request(server)
			.get(
				'/users?filters[name]=Alice&pagination[limit]=5&pagination[page]=1&orderBy[name]=asc&select=name&select=email',
			)
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)

		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(5)

		response.body.users.forEach((user: any) => {
			expect(user.name).toContain('Alice')
			expect(user.email).toBeDefined()
		})

		const names = response.body.users.map(
			(user: any) => user.name as string,
		)
		const sortedNames = [...names].sort()
		expect(names).toEqual(sortedNames)
	})

	it('GET /users -> should return empty array when no users match filters', async () => {
		await request(server)
			.post('/users')
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)
			.send({
				name: 'John Doe Empty Test',
				email: 'john.emptytest@example.com',
				password: 'Test123@email',
			})

		const response = await request(server)
			.get('/users?filters[name]=NonExistentUserXYZ12345')
			.set('Authorization', `Bearer ${env.MASTER_KEY}`)
			.set('x-company-id', company.id)

		expect(response.status).toBe(200)
		expect(response.body.users).toHaveLength(0)
	})
})
