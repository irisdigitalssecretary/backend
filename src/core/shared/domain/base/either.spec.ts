import { left, right } from './either'

describe('Either test', () => {
	it('should be able to create a right', () => {
		const test = right('test')
		expect(test.isRight()).toBe(true)
	})

	it('should be able to create a left', () => {
		const test = left('test')
		expect(test.isLeft()).toBe(true)
	})
})
