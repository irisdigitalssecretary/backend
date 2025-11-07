import { ValueObject } from '../base/value-object'
import { resolvePaginationLimit } from '../utils/helpers/resolve-pagination.helper'

interface OffsetPaginationProps {
	limit: number
	page: number
}

export class OffsetPagination extends ValueObject<OffsetPaginationProps> {
	private constructor(props: OffsetPaginationProps) {
		super(props)
	}

	public get limit(): number {
		return this.props.limit
	}

	public get page(): number {
		return this.props.page
	}

	public get after(): number {
		return (this.page - 1) * this.limit
	}

	public static create(limit?: number, page?: number): OffsetPagination {
		return new OffsetPagination({
			limit: resolvePaginationLimit(limit),
			page: page && page > 0 ? page : 1,
		})
	}
}
