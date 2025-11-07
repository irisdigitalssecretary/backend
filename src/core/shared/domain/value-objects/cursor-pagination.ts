import { ValueObject } from '../base/value-object'
import { resolvePaginationLimit } from '../utils/helpers/resolve-pagination.helper'

interface CursorPaginationProps {
	limit: number
	afterId: number | null
}

export class CursorPagination extends ValueObject<CursorPaginationProps> {
	private constructor(props: CursorPaginationProps) {
		super(props)
	}

	public get limit(): number {
		return this.props.limit
	}

	public get after(): number | null {
		return this.props.afterId || null
	}

	public static create(
		limit?: number,
		afterId?: number | null,
	): CursorPagination {
		return new CursorPagination({
			limit: resolvePaginationLimit(limit),
			afterId: afterId ?? null,
		})
	}
}
