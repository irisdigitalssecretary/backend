import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { env } from '@shared/infra/config/env-validation'
import { PrismaService } from './core/shared/infra/database/prisma/prisma.service'

@Module({
	imports: [MongooseModule.forRoot(env.MONGO_URI as string)],
	controllers: [AppController],
	providers: [PrismaService],
	exports: [PrismaService],
})
export class AppModule {}
