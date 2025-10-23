import { Global, Module } from '@nestjs/common'
import { PrismaService } from '@/core/shared/infra/database/prisma/prisma.service'

@Global()
@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule {}
