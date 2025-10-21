import { PaginationBase } from '../base/pagination-base'

export interface OrderBy<Filters = any> {
	field: keyof Filters
	direction: 'asc' | 'desc'
}

export interface FindManyOptions<
	Filters = any,
	Pagination extends PaginationBase = PaginationBase,
> {
	filters?: Filters
	pagination?: Pagination
	orderBy?: OrderBy<Filters>[]
}
