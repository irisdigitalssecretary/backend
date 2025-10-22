import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { env } from '@shared/infra/config/env-validation'
import { QueryOptions } from 'generated/prisma/runtime/library'

@Injectable()
export class PrismaService extends PrismaClient {
	private static readonly MODELS_WITH_COMPANY = ['User']

	constructor() {
		super({
			log:
				env.APP_ENV === 'production'
					? ['warn', 'error']
					: ['query', 'info', 'warn', 'error'],
			datasourceUrl:
				env.APP_ENV === 'test'
					? env.DATABASE_URL_TEST
					: env.DATABASE_URL,
		})
	}

	private static isModelWithCompany(model: string) {
		return PrismaService.MODELS_WITH_COMPANY.includes(model)
	}

	public withCompany(companyId: number): PrismaService {
		return this.$extends({
			name: 'withCompanyScope',
			query: {
				$allModels: {
					$allOperations({ model, operation, args, query }) {
						if (!PrismaService.isModelWithCompany(model)) {
							return query(args) as QueryOptions
						}

						switch (operation) {
							case 'findMany':
							case 'findFirst':
							case 'findUnique':
								args.where = {
									...(args.where ?? {}),
									companyId,
								}
								break

							case 'create':
								args.data = {
									...(args.data ?? {}),
									companyId,
								}
								break

							case 'update':
							case 'updateMany':
							case 'delete':
							case 'deleteMany':
								args.where = {
									...(args.where ?? {}),
									companyId,
								}
								break
						}

						return query(args) as QueryOptions
					},
				},
			},
		}) as PrismaService
	}

	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}
}
