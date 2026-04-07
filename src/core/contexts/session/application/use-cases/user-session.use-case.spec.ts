import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryUserRepository } from '../../../user/tests/in-memory/in-memory.user.repository'
import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { UserSessionUseCase } from './user-session.use-case'
import { makeUser } from '@/core/shared/tests/unit/factories/make-user-test.factory'
import { InvalidSessionError } from '../errors/invalid-session'
import { TokenGenerator } from '@/core/shared/domain/infra/services/token/token-generator'
import { UserEntity } from '../../../user/domain/entities/user.entity'
import { makeCompany } from '@/core/shared/tests/unit/factories/make-company-test.factory'
import { CompanyEntity } from '../../../company/domain/entities/company.entity'
import { UpdateUserSessionStatusHandler } from '../../../user/application/event-handlers/update-user-session-status.handler'
import { DomainEvents } from '@/core/shared/domain/events/domain-events'

describe('UserSessionUseCase', () => {
    let userRepository: InMemoryUserRepository
    let hasher: BcryptHasher
    let tokenGenerator: TokenGenerator
    let userSessionUseCase: UserSessionUseCase
    let handler
    let company: CompanyEntity

    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        handler = new UpdateUserSessionStatusHandler(userRepository);
        handler.onModuleInit()

        hasher = new BcryptHasher()

        tokenGenerator = {
            sign: vi.fn().mockResolvedValue('any-token'),
            verify: vi.fn().mockResolvedValue('any-payload')
        } as unknown as TokenGenerator

        userSessionUseCase = new UserSessionUseCase(userRepository, hasher, tokenGenerator)

        company = await makeCompany()
    })

    afterEach(() => {
        DomainEvents.clearHandlers();
    });

    it('should be able to login with valid credentials', async () => {
        const password = 'Test@123'
        const user = await makeUser(Number(company.props.id), hasher)

        await userRepository.create(user)

        const result = await userSessionUseCase.execute({
            email: user.email,
            password,
            companyId: Number(company.props.id)
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
            expect(result.value.token).toBe('any-token')
            expect(result.value.refreshToken).toBe('any-token')
            expect(result.value.user).toBeInstanceOf(UserEntity)
            expect(result.value.user.email).toBe(user.email)
        }
    })

    it('should not be able to login with incorrect email', async () => {
        const password = 'Test@123'
        const user = await makeUser(Number(company.props.id), hasher)
        await userRepository.create(user)

        const result = await userSessionUseCase.execute({
            email: 'wrong@example.com',
            password,
            companyId: Number(company.props.id)
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidSessionError)
    })

    it('should not be able to login with incorrect password', async () => {
        const user = await makeUser(Number(company.props.id), hasher)
        await userRepository.create(user)

        const result = await userSessionUseCase.execute({
            email: user.email,
            password: 'wrong-password',
            companyId: Number(company.props.id)
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidSessionError)
    })

    it('should not be able to login if email or password are missing', async () => {
        const result = await userSessionUseCase.execute({
            email: '',
            password: '',
            companyId: Number(company.props.id)
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidSessionError)
    })
})
