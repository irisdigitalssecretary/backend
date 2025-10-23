import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { env } from '@shared/infra/config/env-validation'

@Injectable()
export class PrismaService extends PrismaClient {
	private static readonly MODELS_WITH_COMPANY = ['User']

	constructor() {
		console.log('APP_ENV', env.APP_ENV)
		super({
			log:
				env.APP_ENV === 'production'
					? ['warn', 'error']
					: ['query', 'info', 'warn', 'error'],
			datasourceUrl: env.DATABASE_URL,
		})
	}

	private static isModelWithCompany(model: string) {
		return PrismaService.MODELS_WITH_COMPANY.includes(model)
	}

	// public withCompany(companyId: number): PrismaService {
	// 	return this.$extends({
	// 		name: 'withCompanyScope',

	// 		query: {
	// 			$allModels: {
	// 				$allOperations({
	// 					model,
	// 					operation,
	// 					args,
	// 					query,
	// 				}): Promise<PrismaService> {
	// 					if (!PrismaService.isModelWithCompany(model)) {
	// 						return query(args) as Promise<PrismaService>
	// 					}

	// 					switch (operation) {
	// 						case 'findMany':
	// 						case 'findFirst':
	// 						case 'findUnique':
	// 						case 'update':
	// 						case 'updateMany':
	// 						case 'delete':
	// 						case 'deleteMany':
	// 							args.where = {
	// 								...(args.where ?? {}),
	// 								//companyId,
	// 							}
	// 							break

	// 						case 'create':
	// 							args.data = {
	// 								...(args.data ?? {}),
	// 								//companyId,
	// 							}
	// 							break

	// 						default:
	// 							break
	// 					}

	// 					return query(args) as Promise<PrismaService>
	// 				},
	// 			},
	// 		},
	// 	}) as unknown as PrismaService
	// }

	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}
}
