import { PaginationBase } from '../base/pagination-base'

export type OrderBy<Filters = any> = {
	[K in keyof Filters]?: 'asc' | 'desc'
}

export interface FindManyOptions<
	Filters = any,
	Pagination extends PaginationBase = PaginationBase,
> {
	filters?: Filters
	pagination?: Pagination
	orderBy?: OrderBy<Filters>
}
