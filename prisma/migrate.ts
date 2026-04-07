import { Umzug, JSONStorage } from 'umzug'
import { PrismaClient } from '@prisma/client'
import { env } from '../src/core/shared/infra/config/env-validation.js'
import { PrismaPg } from "@prisma/adapter-pg"

const prisma = new PrismaClient({
	log: ['query', 'error', 'warn'],
	adapter: new PrismaPg({ connectionString: env.DATABASE_URL })
})

const command = process.argv[2] || 'up'

const isTestEnvironment = env.APP_ENV === 'test'

const umzug = new Umzug({
	migrations: {
		glob: isTestEnvironment
			? 'prisma/test/data-migrations/*.ts'
			: 'prisma/data-migrations/*.ts',
	},
	context: { prisma },
	storage: new JSONStorage({
		path: isTestEnvironment
			? 'prisma/test/data-migrations-log.json'
			: 'prisma/data-migrations-log.json',
	}),
	logger: console,
})

async function main() {
	console.log('⏳ Running data migrations...')

	if (command === 'up') {
		await umzug.up()
	}

	if (command === 'down') {
		await umzug.down()
	}

	console.log('✅ Data migrations complete.')
	await prisma.$disconnect()
}

main().catch(async (err) => {
	console.error(err)
	await prisma.$disconnect()
	process.exit(1)
})
