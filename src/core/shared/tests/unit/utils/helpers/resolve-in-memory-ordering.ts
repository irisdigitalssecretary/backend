import { Entity } from '@/core/shared/domain/base/entity'
import { OrderBy } from '@/core/shared/domain/utils/types/find-many'

export function resolveInMemoryOrdering<D extends Entity<Record<string, any>>>(
	data: D[],
	orderBy: OrderBy = {},
): D[] {
	return data.sort((a, b) => {
		for (const [field, direction] of Object.entries(orderBy)) {
			let compareResult = 0

			const fieldA = field === 'id' ? a.props.id : a[field]
			const fieldB = field === 'id' ? b.props.id : b[field]

			if (fieldA && fieldB) {
				if (typeof fieldA === 'string' && typeof fieldB === 'string') {
					compareResult = String(fieldA)
						.toLowerCase()
						.localeCompare(String(fieldB).toLowerCase(), 'pt-BR')
				}

				if (typeof fieldA === 'number' && typeof fieldB === 'number') {
					compareResult = fieldA - fieldB
				}

				if (fieldA instanceof Date && fieldB instanceof Date) {
					compareResult = fieldA.getTime() - fieldB.getTime()
				}
			}

			if (compareResult !== 0) {
				return direction === 'desc' ? -compareResult : compareResult
			}
		}

		return 0
	})
}
