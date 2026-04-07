import { Module } from '@nestjs/common'
import { UserSessionUseCase } from './application/use-cases/user-session.use-case'
import { UserController } from './infra/http/controllers/user-session.controller'
import { UserRepository } from '../user/domain/repositories/user.repository'
import { PrismaUserRepository } from '../user/infra/database/prisma/prisma-user.repository'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'
import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { TokenGenerator } from '@/core/shared/domain/infra/services/token/token-generator'
import { JwtTokenGeneratorService } from '@/core/shared/infra/services/token/jwt-token-generator.service'

@Module({
    controllers: [UserController],
    providers: [
        UserSessionUseCase,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        {
            provide: Hasher,
            useClass: BcryptHasher,
        },
        {
            provide: TokenGenerator,
            useClass: JwtTokenGeneratorService,
        },
    ],
})
export class SessionModule { }
