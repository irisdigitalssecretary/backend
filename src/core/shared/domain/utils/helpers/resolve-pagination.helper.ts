const MAX_LIMIT = 70
const DEFAULT_LIMIT = 15

export function resolvePaginationLimit(limit?: number): number {
	const requestedLimit = limit ?? DEFAULT_LIMIT
	return Math.min(requestedLimit, MAX_LIMIT)
}
