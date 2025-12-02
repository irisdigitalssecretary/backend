import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'
import { createApp } from 'test/utils/create-app'

describe('CompanyController.create (E2E)', () => {
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

	it('POST /companies -> should be able to create a company', async () => {
		const newCompany = {
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
		}

		const response = await request(server)
			.post('/companies')
			.send(newCompany)

		delete (newCompany as any).countryCode

		expect(response.status).toBe(201)
		expect(response.body).toMatchObject({
			company: {
				...newCompany,
				id: expect.any(Number),
				uuid: expect.any(String),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
				phone: newCompany.phone.replace(/[^0-9]/g, ''),
				landline: newCompany.landline.replace(/[^0-9]/g, ''),
				taxId: newCompany.taxId.replace(/[^a-zA-Z0-9]/g, ''),
				zip: newCompany.zip.replace(/[^a-zA-Z0-9]/g, ''),
			},
		})

		const company = await app.get(PrismaService).company.findFirst({})
		expect(company).toMatchObject({
			...newCompany,
			id: expect.any(Number),
			uuid: expect.any(String),
			createdAt: expect.anything(),
			updatedAt: expect.anything(),
			status: 'onboarding',
			phone: newCompany.phone.replace(/[^0-9]/g, ''),
			landline: newCompany.landline.replace(/[^0-9]/g, ''),
			taxId: newCompany.taxId.replace(/[^a-zA-Z0-9]/g, ''),
			zip: newCompany.zip.replace(/[^a-zA-Z0-9]/g, ''),
		})
	})

	it('POST /companies -> should not be able to create a company if taxId already exists', async () => {
		const company1 = {
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
		}

		await request(server).post('/companies').send(company1)

		const response = await request(server)
			.post('/companies')
			.send({
				...company1,
				email: 'company2@example.com',
			})

		expect(response.status).toBe(409)
		expect(response.body).toMatchObject({
			message: 'Já existe uma empresa com este código fiscal cadastrado',
			statusCode: 409,
		})

		const companies = await app.get(PrismaService).company.findMany({})
		expect(companies).toHaveLength(1)
	})

	it('POST /companies -> should not be able to create a company if email already exists', async () => {
		const company1 = {
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
		}

		await request(server).post('/companies').send(company1)

		const response = await request(server)
			.post('/companies')
			.send({
				...company1,
				taxId: '01894147000216',
			})

		expect(response.status).toBe(409)
		expect(response.body).toMatchObject({
			message: 'Já existe uma empresa com este email cadastrado',
			statusCode: 409,
		})

		const companies = await app.get(PrismaService).company.findMany({})
		expect(companies).toHaveLength(1)
	})

	it('POST /companies -> should not be able to create a company if country is not found', async () => {
		const newCompany = {
			name: 'Company 1',
			email: 'company1@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'Rio de Janeiro',
			businessArea: 'Technology',
			personType: 'company',
			countryCode: 'ASAAS',
			zip: '89160306',
			landline: '+551135211980',
			phone: '+5511988899090',
			description: 'Company 1 description is valid!',
		}

		const response = await request(server)
			.post('/companies')
			.send(newCompany)

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'invalid_value',
					path: ['countryCode'],
					message: 'Código de país inválido',
				},
			],
			statusCode: 400,
			message: 'Validation failed',
		})

		const companies = await app.get(PrismaService).company.findMany({})
		expect(companies).toHaveLength(0)
	})

	it('PUT /companies/:id -> should be able to update a company', async () => {
		const newCompany = {
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
		}

		const createResponse = await request(server)
			.post('/companies')
			.send(newCompany)

		const companyId = createResponse.body.company.id

		const updatedCompany = {
			...newCompany,
			name: 'Company 1 Updated',
			email: 'company1updated@example.com',
			description: 'Company 1 description has been updated!',
			taxId: '01894147000216',
		}

		const response = await request(server)
			.put(`/companies/${companyId}`)
			.send(updatedCompany)

		delete (updatedCompany as any).countryCode

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({
			company: {
				...updatedCompany,
				id: companyId,
				uuid: expect.any(String),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
				phone: updatedCompany.phone.replace(/[^0-9]/g, ''),
				landline: updatedCompany.landline.replace(/[^0-9]/g, ''),
				taxId: updatedCompany.taxId.replace(/[^a-zA-Z0-9]/g, ''),
				zip: updatedCompany.zip.replace(/[^a-zA-Z0-9]/g, ''),
			},
		})

		const company = await app.get(PrismaService).company.findFirst({
			where: { id: companyId },
		})
		expect(company).toMatchObject({
			...updatedCompany,
			id: companyId,
			uuid: expect.any(String),
			createdAt: expect.anything(),
			updatedAt: expect.anything(),
			phone: updatedCompany.phone.replace(/[^0-9]/g, ''),
			landline: updatedCompany.landline.replace(/[^0-9]/g, ''),
			taxId: updatedCompany.taxId.replace(/[^a-zA-Z0-9]/g, ''),
			zip: updatedCompany.zip.replace(/[^a-zA-Z0-9]/g, ''),
		})
	})

	it('PUT /companies/:id -> should not be able to update a company if it does not exist', async () => {
		const updatedCompany = {
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
		}

		const response = await request(server)
			.put('/companies/999999')
			.send(updatedCompany)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Empresa não encontrada.',
			statusCode: 404,
		})
	})

	it('PUT /companies/:id -> should not be able to update a company if taxId already exists in another company', async () => {
		const company1 = {
			name: 'Company 2',
			email: 'company2@example.com',
			taxId: '01894147000216',
			address: '456 Other St',
			city: 'Othertown',
			state: 'São Paulo',
			businessArea: 'Finance',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160307',
			landline: '+551135211981',
			phone: '+5511988899091',
			description: 'Company 2 description is valid!',
		}

		const companyToUpdateData = {
			name: 'Company 1',
			email: 'company1@example.com',
			taxId: '01894147000135',
			address: '123 Main St',
			city: 'Anytown',
			state: 'São Paulo',
			businessArea: 'Technology',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160307',
			landline: '+551135211981',
			phone: '+5511988899091',
			description: 'Company 1 description is valid!',
		}

		await request(server).post('/companies').send(company1)
		const createCompanyToUpdateResponse = await request(server)
			.post('/companies')
			.send(companyToUpdateData)

		const response = await request(server)
			.put(`/companies/${createCompanyToUpdateResponse.body.company.id}`)
			.send({
				...companyToUpdateData,
				taxId: company1.taxId,
			})

		expect(response.status).toBe(409)
		expect(response.body).toMatchObject({
			message: 'Já existe uma empresa com este código fiscal cadastrado',
			statusCode: 409,
		})
	})

	it('PUT /companies/:id -> should not be able to update a company if email already exists in another company', async () => {
		const company1 = {
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
		}

		const company2 = {
			name: 'Company 2',
			email: 'company2@example.com',
			taxId: '01894147000216',
			address: '456 Other St',
			city: 'Othertown',
			state: 'São Paulo',
			businessArea: 'Finance',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160307',
			landline: '+551135211981',
			phone: '+5511988899091',
			description: 'Company 2 description is valid!',
		}

		await request(server).post('/companies').send(company1)
		const createResponse2 = await request(server)
			.post('/companies')
			.send(company2)

		const company2Id = createResponse2.body.company.id

		const response = await request(server)
			.put(`/companies/${company2Id}`)
			.send({
				...company2,
				email: company1.email,
			})

		expect(response.status).toBe(409)
		expect(response.body).toMatchObject({
			message: 'Já existe uma empresa com este email cadastrado',
			statusCode: 409,
		})

		const company2Updated = await app
			.get(PrismaService)
			.company.findFirst({ where: { id: company2Id } })
		expect(company2Updated?.email).toBe(company2.email)
	})

	it('PUT /companies/:id -> should not be able to update a company if country is not found', async () => {
		const newCompany = {
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
		}

		const createResponse = await request(server)
			.post('/companies')
			.send(newCompany)

		const companyId = createResponse.body.company.id

		const response = await request(server)
			.put(`/companies/${companyId}`)
			.send({
				...newCompany,
				countryCode: 'ASAAS',
			})

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			errors: [
				{
					code: 'invalid_value',
					path: ['countryCode'],
					message: 'Código de país inválido',
				},
			],
			statusCode: 400,
			message: 'Validation failed',
		})

		const company = await app.get(PrismaService).company.findFirst({
			where: { id: companyId },
		})

		expect(company?.name).toBe(newCompany.name)
	})

	it('PATCH /companies/:id/status -> should be able to update a company status', async () => {
		const newCompany = {
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
		}

		const createResponse = await request(server)
			.post('/companies')
			.send(newCompany)

		const companyId = createResponse.body.company.id

		const response = await request(server)
			.patch(`/companies/${companyId}/status`)
			.send({ status: 'active' })

		delete (newCompany as any).countryCode

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({
			company: {
				...newCompany,
				landline: newCompany.landline.replace(/[^0-9]/g, ''),
				phone: newCompany.phone.replace(/[^0-9]/g, ''),
				status: 'active',
			},
		})

		const company = await app.get(PrismaService).company.findFirst({
			where: { id: companyId },
		})
		expect(company?.status).toBe('active')
	})

	it('PATCH /companies/:id/status -> should not be able to update a company status if it does not exist', async () => {
		const response = await request(server)
			.patch(`/companies/12312/status`)
			.send({ status: 'active' })

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Empresa não encontrada.',
			statusCode: 404,
		})
	})

	it('GET /companies/:uuid -> should be able to find a company by uuid', async () => {
		const newCompany = {
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
		}

		const createResponse = await request(server)
			.post('/companies')
			.send(newCompany)

		const companyUuid = createResponse.body.company.uuid

		const response = await request(server).get(`/companies/${companyUuid}`)

		delete (newCompany as any).countryCode

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({
			company: {
				...newCompany,
				uuid: companyUuid,
				id: expect.any(Number),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
				status: 'onboarding',
				phone: newCompany.phone.replace(/[^0-9]/g, ''),
				landline: newCompany.landline.replace(/[^0-9]/g, ''),
				taxId: newCompany.taxId.replace(/[^a-zA-Z0-9]/g, ''),
				zip: newCompany.zip.replace(/[^a-zA-Z0-9]/g, ''),
			},
		})
	})

	it('GET /companies/:uuid -> should not be able to find a company with non-existent uuid', async () => {
		const nonExistentUuid = '550e8400-e29b-41d4-a716-446655440000'

		const response = await request(server).get(
			`/companies/${nonExistentUuid}`,
		)

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Empresa não encontrada.',
			statusCode: 404,
		})
	})

	it('DELETE /companies/:id -> should be able to delete a company', async () => {
		const newCompany = {
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
		}

		const createResponse = await request(server)
			.post('/companies')
			.send(newCompany)

		const companyId = createResponse.body.company.id

		const response = await request(server).delete(`/companies/${companyId}`)

		expect(response.status).toBe(200)

		const companies = await app.get(PrismaService).company.findMany({})
		expect(companies).toHaveLength(0)

		const deletedCompany = await app.get(PrismaService).company.findFirst({
			where: { id: companyId },
		})
		expect(deletedCompany).toBeNull()
	})

	it('DELETE /companies/:id -> should not be able to delete a company if it does not exist', async () => {
		const response = await request(server).delete('/companies/999999')

		expect(response.status).toBe(404)
		expect(response.body).toMatchObject({
			message: 'Empresa não encontrada.',
			statusCode: 404,
		})
	})

	it('GET /companies -> should be able to find many companies with pagination', async () => {
		const company1 = {
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
		}

		const company2 = {
			name: 'Company 2',
			email: 'company2@example.com',
			taxId: '01894147000216',
			address: '456 Other St',
			city: 'Othertown',
			state: 'São Paulo',
			businessArea: 'Finance',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160307',
			landline: '+551135211981',
			phone: '+5511988899091',
			description: 'Company 2 description is valid!',
		}

		const company3 = {
			name: 'Company 3',
			email: 'company3@example.com',
			taxId: '01894147000324',
			address: '789 Third St',
			city: 'Thirdtown',
			state: 'Minas Gerais',
			businessArea: 'Retail',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160308',
			landline: '+551135211982',
			phone: '+5511988899092',
			description: 'Company 3 description is valid!',
		}

		await request(server).post('/companies').send(company1)
		await request(server).post('/companies').send(company2)
		await request(server).post('/companies').send(company3)

		const response = await request(server)
			.get('/companies')
			.query({ pagination: { limit: 2, page: 1 } })

		expect(response.status).toBe(200)
		expect(response.body.companies).toHaveLength(2)
	})

	it('GET /companies -> should be able to filter companies by name', async () => {
		const company1 = {
			name: 'Tech Company',
			email: 'tech@example.com',
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
			description: 'Tech company description',
		}

		const company2 = {
			name: 'Finance Company',
			email: 'finance@example.com',
			taxId: '01894147000216',
			address: '456 Other St',
			city: 'Othertown',
			state: 'São Paulo',
			businessArea: 'Finance',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160307',
			landline: '+551135211981',
			phone: '+5511988899091',
			description: 'Finance company description',
		}

		await request(server).post('/companies').send(company1)
		await request(server).post('/companies').send(company2)

		const response = await request(server)
			.get('/companies')
			.query({ filters: { name: 'Tech' } })

		expect(response.status).toBe(200)
		expect(response.body.companies).toHaveLength(1)
		expect(response.body.companies[0].name).toContain('Tech')
	})

	it.only('GET /companies -> should be able to filter companies by status', async () => {
		const company1 = {
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
			description: 'Company 1 description',
		}

		const company2 = {
			name: 'Company 2',
			email: 'company2@example.com',
			taxId: '01894147000216',
			address: '456 Other St',
			city: 'Othertown',
			state: 'São Paulo',
			businessArea: 'Finance',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160307',
			landline: '+551135211981',
			phone: '+5511988899091',
			description: 'Company 2 description',
		}

		const createResponse1 = await request(server)
			.post('/companies')
			.send(company1)
		await request(server).post('/companies').send(company2)

		await request(server)
			.patch(`/companies/${createResponse1.body.company.id}/status`)
			.send({ status: 'active' })

		const response = await request(server)
			.get('/companies')
			.query({ filters: { status: 'active' } })

		expect(response.status).toBe(200)
		expect(response.body.companies).toHaveLength(1)
		expect(response.body.companies[0].status).toBe('active')
	})

	it('GET /companies -> should be able to order companies by name ascending', async () => {
		const company1 = {
			name: 'Zebra Company',
			email: 'zebra@example.com',
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
			description: 'Zebra company description',
		}

		const company2 = {
			name: 'Alpha Company',
			email: 'alpha@example.com',
			taxId: '01894147000216',
			address: '456 Other St',
			city: 'Othertown',
			state: 'São Paulo',
			businessArea: 'Finance',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160307',
			landline: '+551135211981',
			phone: '+5511988899091',
			description: 'Alpha company description',
		}

		await request(server).post('/companies').send(company1)
		await request(server).post('/companies').send(company2)

		const response = await request(server)
			.get('/companies')
			.query({ orderBy: { name: 'asc' } })

		expect(response.status).toBe(200)
		expect(response.body.companies).toHaveLength(2)
		expect(response.body.companies[0].name).toBe('Alpha Company')
		expect(response.body.companies[1].name).toBe('Zebra Company')
	})

	it('GET /companies -> should be able to order companies by name descending', async () => {
		const company1 = {
			name: 'Alpha Company',
			email: 'alpha@example.com',
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
			description: 'Alpha company description',
		}

		const company2 = {
			name: 'Zebra Company',
			email: 'zebra@example.com',
			taxId: '01894147000216',
			address: '456 Other St',
			city: 'Othertown',
			state: 'São Paulo',
			businessArea: 'Finance',
			personType: 'company',
			countryCode: 'BR',
			zip: '89160307',
			landline: '+551135211981',
			phone: '+5511988899091',
			description: 'Zebra company description',
		}

		await request(server).post('/companies').send(company1)
		await request(server).post('/companies').send(company2)

		const response = await request(server)
			.get('/companies')
			.query({ orderBy: { name: 'desc' } })

		expect(response.status).toBe(200)
		expect(response.body.companies).toHaveLength(2)
		expect(response.body.companies[0].name).toBe('Zebra Company')
		expect(response.body.companies[1].name).toBe('Alpha Company')
	})

	it('GET /companies -> should be able to select specific fields', async () => {
		const company1 = {
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
			description: 'Company 1 description',
		}

		await request(server).post('/companies').send(company1)

		const response = await request(server)
			.get('/companies')
			.query({ select: ['id', 'name', 'email'] })

		expect(response.status).toBe(200)
		expect(response.body.companies).toHaveLength(1)
		expect(Object.keys(response.body.companies[0])).toEqual(
			expect.arrayContaining(['id', 'name', 'email']),
		)
		expect(response.body.companies[0]).not.toHaveProperty('taxId')
		expect(response.body.companies[0]).not.toHaveProperty('address')
	})
})
