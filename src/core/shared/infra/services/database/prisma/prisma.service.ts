import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { env } from '@shared/infra/config/env-validation'

@Injectable()
export class PrismaService extends PrismaClient {
	private static readonly MODELS_WITH_COMPANY = ['User']

	constructor() {
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

	public buildSelectObject<T extends string>(
		fields?: T[],
	): Record<T, boolean> | undefined {
		if (!fields || fields.length === 0) {
			return undefined
		}

		return fields.reduce(
			(acc, field) => {
				acc[field] = true
				return acc
			},
			{} as Record<T, boolean>,
		)
	}

	public withCompany(companyId: number): PrismaService {
		return this.$extends({
			name: 'withCompanyScope',

			query: {
				$allModels: {
					$allOperations({
						model,
						operation,
						args,
						query,
					}): Promise<PrismaService> {
						if (!PrismaService.isModelWithCompany(model)) {
							return query(args) as Promise<PrismaService>
						}

						switch (operation) {
							case 'findMany':
							case 'findFirst':
							case 'findUnique':
							case 'updateMany':
							case 'deleteMany':
								args.where = {
									...(args.where ?? {}),
									companyId,
								}
								break

							default:
								break
						}

						return query(args) as Promise<PrismaService>
					},
				},
			},
		}) as unknown as PrismaService
	}

	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}

	async cleanDatabase() {
		const tables = await this.$queryRaw<{ tablename: string }[]>`
		  SELECT tablename
		  FROM pg_tables
		  WHERE schemaname = 'public'
		  AND tablename NOT IN ('_prisma_migrations', 'Country')
		`

		for (const table of tables) {
			await this.$executeRawUnsafe(
				`TRUNCATE TABLE "${table.tablename}" CASCADE;`,
			)
		}
	}
}
