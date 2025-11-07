import { OffsetPagination } from './offset-pagination'

describe('OffsetPagination', () => {
	it('should be able to create a new offset pagination', () => {
		const offsetPagination = OffsetPagination.create(10, 1)
		expect(offsetPagination.limit).toBe(10)
		expect(offsetPagination.after).toBe(0)
		expect(offsetPagination.page).toBe(1)
	})

	it('should be able to create a new offset pagination with default limit', () => {
		const offsetPagination = OffsetPagination.create()
		expect(offsetPagination.limit).toBe(15)
		expect(offsetPagination.after).toBe(0)
		expect(offsetPagination.page).toBe(1)
	})

	it('should be able to create a new offset pagination with a limit greater than the maximum limit', () => {
		const offsetPagination = OffsetPagination.create(100, 1)
		expect(offsetPagination.limit).toBe(70)
		expect(offsetPagination.after).toBe(0)
		expect(offsetPagination.page).toBe(1)
	})

	it('should be able to calculate after correctly for different pages', () => {
		const offsetPagination1 = OffsetPagination.create(10, 1)
		expect(offsetPagination1.after).toBe(0)

		const offsetPagination2 = OffsetPagination.create(10, 2)
		expect(offsetPagination2.after).toBe(10)

		const offsetPagination3 = OffsetPagination.create(10, 3)
		expect(offsetPagination3.after).toBe(20)
	})
})
