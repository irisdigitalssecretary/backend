import { CursorPagination } from './cursor-pagination'

describe('CursorPagination', () => {
	it('should be able to create a new cursor pagination', () => {
		const cursorPagination = CursorPagination.create(10, 1)
		expect(cursorPagination.limit).toBe(10)
		expect(cursorPagination.offset).toBe(1)
	})

	it('should be able to create a new cursor pagination with a limit greater than the maximum limit', () => {
		const cursorPagination = CursorPagination.create(100, 1)
		expect(cursorPagination.limit).toBe(70)
		expect(cursorPagination.offset).toBe(1)
	})
})
