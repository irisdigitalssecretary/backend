import { PaginationBase } from '../base/pagination-base'

export class CursorPagination extends PaginationBase {
	constructor(
		limit?: number,
		private readonly _afterId?: number | null,
	) {
		super(limit)
	}

	public get offset(): number | null {
		return this._afterId || 0
	}

	public static create(
		limit?: number,
		afterId?: number | null,
	): CursorPagination {
		return new CursorPagination(limit, afterId)
	}
}
