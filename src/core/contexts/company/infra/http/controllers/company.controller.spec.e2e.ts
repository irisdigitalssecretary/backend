import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'
import { createApp } from 'test/utils/create-app'
import { env } from '@/core/shared/infra/config/env-validation'

describe('CompanyController (E2E)', () => {
	let app: INestApplication
	let server: any
	let company: Record<string, any>

	const companyData = {
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

	beforeAll(async () => {
		app = await createApp()
		server = app.getHttpServer()
	})

	beforeEach(async () => {
		await app.get(PrismaService).cleanDatabase()

		const response = await request(server)
			.post('/companies')
			.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
			.send(companyData)

		company = response.body.company
	})

	afterAll(async () => {
		await app.close()
	})

	describe('PUT /companies', () => {
		it('should be able to update a company', async () => {
			const updatedCompanyData = {
				...companyData,
				name: 'Company 1 Updated',
				email: 'company1updated@example.com',
				description: 'Company 1 description has been updated!',
				taxId: '01894147000216',
			}

			const response = await request(server)
				.put('/companies')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.set('x-company-id', String(company.id))
				.send(updatedCompanyData)

			delete (updatedCompanyData as any).countryCode

			expect(response.status).toBe(200)
			expect(response.body).toMatchObject({
				company: {
					...updatedCompanyData,
					id: company.id,
					uuid: expect.any(String),
					phone: updatedCompanyData.phone.replace(/[^0-9]/g, ''),
					landline: updatedCompanyData.landline.replace(/[^0-9]/g, ''),
					taxId: updatedCompanyData.taxId.replace(/[^a-zA-Z0-9]/g, ''),
					zip: updatedCompanyData.zip.replace(/[^a-zA-Z0-9]/g, ''),
				},
			})

			const companyInDb = await app.get(PrismaService).company.findFirst({
				where: { id: company.id },
			})
			expect(companyInDb).toMatchObject({
				...updatedCompanyData,
				id: company.id,
				phone: updatedCompanyData.phone.replace(/[^0-9]/g, ''),
				landline: updatedCompanyData.landline.replace(/[^0-9]/g, ''),
				taxId: updatedCompanyData.taxId.replace(/[^a-zA-Z0-9]/g, ''),
				zip: updatedCompanyData.zip.replace(/[^a-zA-Z0-9]/g, ''),
			})
		})

		it('should not be able to update a company if it does not exist', async () => {
			const response = await request(server)
				.put('/companies')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.set('x-company-id', '999999')
				.send(companyData)

			expect(response.status).toBe(404)
			expect(response.body).toMatchObject({
				message: 'Empresa não encontrada.',
				statusCode: 404,
			})
		})

		it('should not be able to update a company if the country does not exist', async () => {
			const response = await request(server)
				.put('/companies')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.set('x-company-id', String(company.id))
				.send({
					...companyData,
					countryCode: 'FO',
				})

			expect(response.status).toBe(404)
			expect(response.body).toMatchObject({
				message: 'País não encontrado.',
				statusCode: 404,
			})
		})

		it('should not be able to update a company if taxId already exists in another company', async () => {
			const otherCompanyData = {
				...companyData,
				name: 'Company 2',
				email: 'company2@example.com',
				taxId: '01894147000216',
				phone: '+5511988899092',
			}

			await request(server)
				.post('/companies')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.send(otherCompanyData)

			const response = await request(server)
				.put('/companies')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.set('x-company-id', String(company.id))
				.send({
					...companyData,
					taxId: otherCompanyData.taxId,
				})

			expect(response.status).toBe(409)
			expect(response.body).toMatchObject({
				message: 'Já existe uma empresa com este código fiscal cadastrado',
				statusCode: 409,
			})
		})

		it('should not be able to update a company if email already exists in another company', async () => {
			const otherCompanyData = {
				...companyData,
				name: 'Company 2',
				email: 'other@example.com',
				taxId: '01894147000216',
				phone: '+5511988899092',
			}

			await request(server)
				.post('/companies')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.send(otherCompanyData)

			const response = await request(server)
				.put('/companies')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.set('x-company-id', String(company.id))
				.send({
					...companyData,
					email: otherCompanyData.email,
				})

			expect(response.status).toBe(409)
			expect(response.body).toMatchObject({
				message: 'Já existe uma empresa com este email cadastrado',
				statusCode: 409,
			})
		})
	})

	describe('PATCH /companies/status', () => {
		it('should be able to update a company status', async () => {
			const response = await request(server)
				.patch('/companies/status')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.set('x-company-id', String(company.id))
				.send({ status: 'active' })

			expect(response.status).toBe(200)
			expect(response.body).toMatchObject({
				company: {
					id: company.id,
					status: 'active',
				},
			})

			const companyInDb = await app.get(PrismaService).company.findFirst({
				where: { id: company.id },
			})
			expect(companyInDb?.status).toBe('active')
		})

		it('should not be able to update a company status if it does not exist', async () => {
			const response = await request(server)
				.patch('/companies/status')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.set('x-company-id', '999999')
				.send({ status: 'active' })

			expect(response.status).toBe(404)
			expect(response.body).toMatchObject({
				message: 'Empresa não encontrada.',
				statusCode: 404,
			})
		})
	})

	describe('GET /companies/my-company', () => {
		it('should be able to find my company', async () => {
			const response = await request(server)
				.get('/companies/my-company')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.set('x-company-id', String(company.id))

			const expectedData = { ...companyData }
			delete (expectedData as any).countryCode

			expect(response.status).toBe(200)
			expect(response.body).toMatchObject({
				company: {
					...expectedData,
					id: company.id,
					uuid: company.uuid,
					status: 'onboarding',
					phone: expectedData.phone.replace(/[^0-9]/g, ''),
					landline: expectedData.landline.replace(/[^0-9]/g, ''),
					taxId: expectedData.taxId.replace(/[^a-zA-Z0-9]/g, ''),
					zip: expectedData.zip.replace(/[^a-zA-Z0-9]/g, ''),
				},
			})
		})

		it('should not be able to find my company if it does not exist', async () => {
			const response = await request(server)
				.get('/companies/my-company')
				.set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
				.set('x-company-id', '999999')

			expect(response.status).toBe(404)
			expect(response.body).toMatchObject({
				message: 'Empresa não encontrada.',
				statusCode: 404,
			})
		})
	})
})
