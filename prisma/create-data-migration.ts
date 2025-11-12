import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

function getTimestamp(): string {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	const seconds = String(now.getSeconds()).padStart(2, '0')

	return `${year}${month}${day}${hours}${minutes}${seconds}`
}

function formatMigrationName(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '_')
		.replace(/[^a-z0-9_]/g, '')
}

function createMigrationFile(name: string): void {
	if (!name) {
		console.error('❌ Error: Migration name is required')
		console.log('Usage: npm run data:create <migration-name>')
		process.exit(1)
	}

	const timestamp = getTimestamp()
	const formattedName = formatMigrationName(name)
	const fileName = `${timestamp}_${formattedName}.ts`
	const migrationsDir = resolve(__dirname, 'data-migrations')
	const filePath = resolve(migrationsDir, fileName)

	if (!existsSync(migrationsDir)) {
		mkdirSync(migrationsDir, { recursive: true })
	}

	const template = `import type { MigrationFn } from 'umzug'
import type { PrismaClient } from '@prisma/client'

export const up: MigrationFn<{ prisma: PrismaClient }> = async ({ context }) => {
	const { prisma } = context

	// TODO: Implement your migration logic here
}

export const down: MigrationFn<{ prisma: PrismaClient }> = async ({ context }) => {
	const { prisma } = context

	// TODO: Implement your rollback logic here (optional)
}
`

	writeFileSync(filePath, template, 'utf-8')

	console.log('✅ Data migration created successfully!')
	console.log(`📁 File: ${fileName}`)
}

const migrationName = process.argv.slice(2).join(' ')
createMigrationFile(migrationName)
