export type OrderBy<Filters = any> = {
	[K in keyof Filters]?: 'asc' | 'desc'
}

export interface FindManyOptions<
	Filters = any,
	Pagination = any,
	SelectableFields extends string = string,
> {
	filters?: Filters
	pagination?: Pagination
	orderBy?: OrderBy<Filters>
	select?: SelectableFields[]
}
