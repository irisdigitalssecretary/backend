import { execSync } from 'node:child_process'

/**
 * Sobe ambiente de testes e para ambiente de desenvolvimento
 */
export default function setup() {
	console.log('🚀 INICIANDO TESTES E2E')

	execSync('docker compose down')

	execSync(
		'docker compose -f docker-compose.test.yml --env-file ./.env.test up -d',
	)

	execSync('npm run migrate:test')

	console.log('✅ Ambiente de testes configurado')

	return function teardown() {
		console.log('🧹 Removendo ambiente de testes')

		execSync('docker compose -f docker-compose.test.yml down')
		execSync('docker compose up -d')
		console.log('✅ AMBIENTE DE TESTES REMOVIDO!')
	}
}
