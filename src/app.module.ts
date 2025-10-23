import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { env } from '@shared/infra/config/env-validation'
import { UserModule } from './core/contexts/user/user.module'
import { PrismaModule } from './core/shared/modules/prisma.module'

@Module({
	imports: [
		MongooseModule.forRoot(env.MONGO_URI as string),
		UserModule,
		PrismaModule,
	],
	controllers: [AppController],
	providers: [],
	exports: [],
})
export class AppModule {}
