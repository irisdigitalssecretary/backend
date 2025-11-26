import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'
import { createApp } from 'test/utils/create-app'

describe.only('CompanyController.create (E2E)', () => {
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

		expect(response.status).toBe(201)
		expect(response.body).toMatchObject({
			company: {
				...newCompany,
				id: expect.any(Number),
				uuid: expect.any(String),
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				status: 'onboarding',
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
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			status: 'onboarding',
			phone: newCompany.phone.replace(/[^0-9]/g, ''),
			landline: newCompany.landline.replace(/[^0-9]/g, ''),
			taxId: newCompany.taxId.replace(/[^a-zA-Z0-9]/g, ''),
			zip: newCompany.zip.replace(/[^a-zA-Z0-9]/g, ''),
		})
	})
})
