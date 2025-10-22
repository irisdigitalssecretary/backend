export function setup() {
	console.log('✅ tests setup started')

	process.env.APP_ENV = 'test'

	return () => {
		console.log('🧹 tests setup finished')
	}
}
