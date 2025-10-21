import { OffsetPagination } from './offset-pagination'

describe('OffsetPagination', () => {
	it('should be able to create a new offset pagination', () => {
		const offsetPagination = OffsetPagination.create(10, 1)
		expect(offsetPagination.limit).toBe(10)
		expect(offsetPagination.offset).toBe(0)
		expect(offsetPagination.page).toBe(1)
	})

	it('should be able to create a new offset pagination with a limit greater than the maximum limit', () => {
		const offsetPagination = OffsetPagination.create(100, 1)
		expect(offsetPagination.limit).toBe(70)
		expect(offsetPagination.offset).toBe(0)
		expect(offsetPagination.page).toBe(1)
	})
})
