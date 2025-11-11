import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import * as path from 'path'
import { pathToFileURL } from 'url'

const args = process.argv.slice(2)

const prisma = new PrismaClient({
	log:
		process.env.APP_ENV === 'production'
			? ['warn', 'error']
			: ['query', 'info', 'warn', 'error'],
	datasourceUrl: process.env.DATABASE_URL,
})

async function getSeedFiles(seedsDir: string) {
	const allFiles = await fs.readdir(seedsDir)

	const seedFiles = allFiles
		.filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
		.sort()

	if (!seedFiles.length) {
		console.log('No seed files found')
		return
	}

	const executedSeedNames = await prisma.seedHistory.findMany({
		select: {
			filename: true,
		},
	})

	const executedSeedNamesSet = new Set(
		executedSeedNames.map((seed) => seed.filename as string),
	)

	const filesToRun = seedFiles.filter(
		(file) => !executedSeedNamesSet.has(file),
	)

	return filesToRun
}

async function upSeeds() {
	const seedsDir = path.join(__dirname, 'seeds')
	const filesToRun = await getSeedFiles(seedsDir)

	if (!filesToRun?.length) {
		console.log('All seeds have already been executed')
		return
	}

	console.log('Running seeds:', filesToRun)

	for (const file of filesToRun) {
		const seedModulePath = path.join(seedsDir, file)
		const { up } = await import(pathToFileURL(seedModulePath).href)

		if (!up || typeof up !== 'function') {
			console.error(
				`Seed file ${file} does not export a valid up function`,
			)
			continue
		}

		try {
			await prisma.$transaction(async (tx) => {
				await up(tx)
				await tx.seedHistory.create({
					data: {
						filename: file,
					},
				})
			})
		} catch (error) {
			console.error(`Error running seed ${file}:`, error)
			process.exit(1)
		}
	}

	console.log(`Seeds executed successfully: ${filesToRun.join(' \n')}`)
}

async function main() {
	console.log('boceta')
	if (args.includes('--down')) return

	await upSeeds()
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(void (async () => await prisma.$disconnect()))
