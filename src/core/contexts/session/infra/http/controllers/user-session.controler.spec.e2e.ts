import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createApp } from '../../../../../../../test/utils/create-app'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'
import { env } from '@/core/shared/infra/config/env-validation'

describe('UserSessionController (E2E)', () => {
    let app: INestApplication
    let server: any
    let company: Record<string, any>
    const userCredentials = {
        name: 'John Doe Login Test',
        email: 'john.login@example.com',
        password: 'Test123@login',
        phone: '+5511999999999'
    }

    beforeAll(async () => {
        app = await createApp()
        server = app.getHttpServer()
    })

    beforeEach(async () => {
        const prisma = app.get(PrismaService)
        await prisma.cleanDatabase()

        const companyResponse = await request(server)
            .post('/companies')
            .set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
            .send({
                name: 'Login Test Company',
                email: 'testlogin@company.com',
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
                description: 'Company description for login tests',
            })

        company = companyResponse.body.company

        const userResponse = await request(server)
            .post('/users')
            .set('Authorization', `Bearer ${env.MASTER_LOCAL_TESTS_KEY}`)
            .set('x-company-id', company.id)
            .send(userCredentials)

        const createdUserId = userResponse.body.user.id

        await prisma.user.update({
            where: { id: createdUserId },
            data: { isMaster: true },
        })
    })

    afterAll(async () => {
        await app.close()
    })

    it('POST /login -> should be able to authenticate and receive a token', async () => {
        const response = await request(server)
            .post('/login')
            .send({
                email: userCredentials.email,
                password: userCredentials.password,
                companyId: company.id
            })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
            token: expect.any(String),
            user: {
                id: expect.any(Number),
                uuid: expect.any(String),
                name: userCredentials.name,
                email: userCredentials.email,
                phone: userCredentials.phone.replace(/[^0-9]/g, ''),
                status: 'active',
                sessionStatus: 'offline', // Default state
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }
        })

        expect(response.header['set-cookie']).toBeDefined()
        const cookie = response.header['set-cookie'][0]
        expect(cookie).toContain('refresh_token')
    })

    it('POST /login -> should not be able to authenticate with incorrect email', async () => {
        const response = await request(server)
            .post('/login')
            .send({
                email: 'wrong-email@example.com',
                password: userCredentials.password,
                companyId: company.id
            })

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({
            message: 'E-mail e/ou senha inválidos.',
            statusCode: 401
        })
    })

    it('POST /login -> should not be able to authenticate with incorrect password', async () => {
        const response = await request(server)
            .post('/login')
            .send({
                email: userCredentials.email,
                password: 'wrong-password',
                companyId: company.id
            })

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({
            message: 'E-mail e/ou senha inválidos.',
            statusCode: 401
        })
    })

    it('POST /login -> should not be able to authenticate if company id is incorrect', async () => {
        const response = await request(server)
            .post('/login')
            .send({
                email: userCredentials.email,
                password: userCredentials.password,
                companyId: 9999 // Different company
            })

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({
            message: 'E-mail e/ou senha inválidos.',
            statusCode: 401
        })
    })
})
