import { execSync } from 'node:child_process'
import { config } from 'dotenv'

export default function setup() {
	console.log('🚀 INICIANDO TESTES E2E')

	config({ path: '.env.test' })

	execSync(
		'docker compose -f docker-compose.test.yml --env-file ./.env.test up -d',
	)
	// execSync('npm run migrate:test', { stdio: 'inherit' })

	console.log('✅ Ambiente de testes configurado')

	return function teardown() {
		console.log('🧹 Removendo ambiente de testes')
		execSync('docker compose -f docker-compose.test.yml down')
		console.log('✅ AMBIENTE DE TESTES REMOVIDO!')
	}
}
