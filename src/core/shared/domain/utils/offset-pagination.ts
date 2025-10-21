import { PaginationBase } from '../base/pagination-base'

export class OffsetPagination extends PaginationBase {
	constructor(
		limit?: number,
		public readonly page: number = 1,
	) {
		super(limit)
	}

	public get offset(): number {
		return (this.page - 1) * this.limit
	}

	public static create(limit?: number, page?: number): OffsetPagination {
		return new OffsetPagination(limit, page || 1)
	}
}
