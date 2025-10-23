import { execSync } from 'node:child_process'

export default function setup() {
	console.log('🚀 INICIANDO TESTES E2E')

	process.env.APP_ENV = 'test'

	execSync(
		'docker compose -f docker-compose.test.yml --env-file ./.env.test up -d',
	)
	execSync('npm run migrate:test', { stdio: 'inherit' })

	console.log('✅ Ambiente de testes configurado')

	return function teardown() {
		console.log('🧹 Removendo ambiente de testes')
		execSync('docker compose -f docker-compose.test.yml down')
		console.log('✅ AMBIENTE DE TESTES REMOVIDO!')
	}
}
