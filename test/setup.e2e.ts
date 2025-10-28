import { execSync } from 'node:child_process'
import { PrismaService } from '@/core/shared/infra/services/database/prisma/prisma.service'

export default async function setup() {
	console.log('🚀 INICIANDO TESTES E2E')

	execSync('docker compose down')

	execSync(
		'docker compose -f docker-compose.test.yml --env-file ./.env.test up -d',
	)

	execSync('npm run migrate:test')

	console.log('✅ Ambiente de testes configurado')

	const prisma = new PrismaService()
	await prisma.cleanDatabase()
	await prisma.$disconnect()

	return function teardown() {
		console.log('🧹 Removendo ambiente de testes')

		execSync('docker compose -f docker-compose.test.yml down')
		execSync('docker compose up -d')
		console.log('✅ AMBIENTE DE TESTES REMOVIDO!')
	}
}
