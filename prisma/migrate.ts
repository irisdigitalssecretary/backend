import { Umzug, JSONStorage } from 'umzug'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const command = process.argv[2] || 'up'

const umzug = new Umzug({
	migrations: {
		glob: 'prisma/data-migrations/*.ts',
	},
	context: { prisma },
	storage: new JSONStorage({ path: 'prisma/data-migrations-log.json' }),
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
