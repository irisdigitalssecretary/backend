import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from '../../../app.controller'
import { env } from '@shared/infra/config/env-validation'
import { UserModule } from '../../contexts/user/user.module'
import { PrismaModule } from './prisma.module'
import { CompanyModule } from '../../contexts/company/company.module'
import { SessionModule } from '../../contexts/session/session.module'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { TokenGenerator } from '../domain/infra/services/token/token-generator'
import { JwtTokenGeneratorService } from '../infra/services/token/jwt-token-generator.service'
import { AuthModule } from './auth.module'

@Module({
	imports: [
		MongooseModule.forRoot(env.MONGO_URI as string),
		AuthModule,
		UserModule,
		PrismaModule,
		CompanyModule,
		SessionModule,
	],
	controllers: [AppController],
	providers: [],
	exports: [],
})
export class AppModule { }
