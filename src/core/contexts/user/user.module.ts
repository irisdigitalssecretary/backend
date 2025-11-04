import { Module } from '@nestjs/common'
import { CreateUserUseCase } from './application/use-cases/create-user.use-case'
import { UserController } from './infra/http/controllers/user.controller'
import { UserRepository } from './domain/repositories/user-repository'
import { PrismaUserRepository } from './infra/database/prisma/prisma-user-repository'
import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { Hasher } from '@/core/shared/domain/infra/services/hasher'
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case'

@Module({
	controllers: [UserController],
	providers: [
		CreateUserUseCase,
		UpdateUserUseCase,
		{
			provide: UserRepository,
			useClass: PrismaUserRepository,
		},
		{
			provide: Hasher,
			useClass: BcryptHasher,
		},
	],
})
export class UserModule {}
