import { Module } from '@nestjs/common'
import { CreateUserUseCase } from './application/use-cases/create-user.use-case'
import { UserController } from './infra/http/controllers/user.controller'
import { UserRepository } from './domain/repositories/user.repository'
import { PrismaUserRepository } from './infra/database/prisma/prisma-user.repository'
import { BcryptHasher } from '@/core/shared/infra/services/crypt/bcrypt-hasher.service'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case'
import { UpdateUserSessionStatusUseCase } from './application/use-cases/update-user-session-status.use-case'
import { UpdateUserStatusUseCase } from './application/use-cases/update-user-status.use-case'
import { DeleteUserByIdUseCase } from './application/use-cases/delete-user-by-id.use-case'
import { FindUserByUuidUseCase } from './application/use-cases/find-user-by-uuid.use-case'
import { FindManyUsersByOffsetPaginationUseCase } from './application/use-cases/find-many-users-by-offset-pagination.use-case'

@Module({
	controllers: [UserController],
	providers: [
		CreateUserUseCase,
		UpdateUserUseCase,
		UpdateUserSessionStatusUseCase,
		UpdateUserStatusUseCase,
		DeleteUserByIdUseCase,
		FindUserByUuidUseCase,
		FindManyUsersByOffsetPaginationUseCase,
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
