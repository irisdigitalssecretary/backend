export abstract class PaginationBase {
	protected static readonly MAX_LIMIT = 70
	protected readonly _limit: number | undefined

	constructor(limit?: number) {
		this._limit = limit
	}

	public get limit(): number {
		if (!this._limit) return 10

		return this._limit > PaginationBase.MAX_LIMIT
			? PaginationBase.MAX_LIMIT
			: this._limit
	}
}
