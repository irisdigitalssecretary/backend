import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { env } from '@config/env.validation'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRoot(env.MONGO_URI as string),
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
