import { execSync } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
const testDir = path.resolve(__dirname, '../prisma/test')

const removeTestsSeeds = () => {
	console.log('🔄 Removendo seeds do diretório de teste...')
	if (fs.existsSync(testDir)) {
		const file = 'data-migrations-log.json'
		const dataMigrationsLogPath = path.join(testDir, file)
		if (fs.existsSync(dataMigrationsLogPath)) {
			fs.unlinkSync(dataMigrationsLogPath)
		}
	}
}

const copySeedsToTestDir = () => {
	console.log('🔄 Copiando seeds para diretório de teste...')
	const seedsDir = path.resolve(__dirname, '../prisma/data-migrations')
	const testDataMigrationsDir = path.join(testDir, 'data-migrations')

	// Garante que o diretório base prisma/test existe
	if (!fs.existsSync(testDir)) {
		console.log(`📁 Criando diretório base: ${testDir}`)
		fs.mkdirSync(testDir, { recursive: true })
	}

	// Garante que o diretório prisma/test/data-migrations existe
	if (!fs.existsSync(testDataMigrationsDir)) {
		console.log(`📁 Criando diretório: ${testDataMigrationsDir}`)
		fs.mkdirSync(testDataMigrationsDir, { recursive: true })
	}

	if (fs.existsSync(seedsDir)) {
		console.log(
			`📋 Copiando arquivos de ${seedsDir} para ${testDataMigrationsDir}`,
		)
		fs.readdirSync(seedsDir).forEach((file) => {
			const curPath = path.join(seedsDir, file)
			const destPath = path.join(testDataMigrationsDir, file)

			if (fs.lstatSync(curPath).isFile()) {
				console.log(`   ↳ Copiando arquivo: ${file}`)
				fs.copyFileSync(curPath, destPath)
			}

			if (fs.lstatSync(curPath).isDirectory()) {
				console.log(`   ↳ Copiando diretório: ${file}`)
				fs.cpSync(curPath, destPath, {
					recursive: true,
				})
			}
		})
		console.log('✅ Arquivos copiados com sucesso')
	} else {
		console.log(`⚠️  Diretório de origem não encontrado: ${seedsDir}`)
	}
}

/**
 * Sobe ambiente de testes e para ambiente de desenvolvimento
 */
export default function setup() {
	console.log('🚀 INICIANDO TESTES E2E')

	execSync('docker compose down')

	console.log('🏗️  Subindo ambiente de testes...')

	execSync(
		'docker compose -f docker-compose.test.yml --env-file ./.env.test up -d --wait',
	)

	execSync('node -e "setTimeout(() => {}, 2000)"')
	console.log('🏗️  Resetando banco de dados...')
	execSync('npx prisma db push --force-reset')
	removeTestsSeeds()
	copySeedsToTestDir()
	console.log('🔄 Executando seeds de teste...')
	execSync('npm run data:migrate:run:test')

	console.log('✅ Ambiente de testes configurado')

	return function teardown() {
		console.log('🧹 Removendo ambiente de testes')

		execSync('docker compose -f docker-compose.test.yml down')
		execSync('dotenv -e .env -- docker compose up')
		console.log('✅ AMBIENTE DE TESTES REMOVIDO!')
	}
}
