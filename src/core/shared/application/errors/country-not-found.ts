import { ApplicationError } from '@/core/shared/application/base/application-error'

export class CountryNotFoundError extends ApplicationError {
	constructor() {
		super('País não encontrado.', 404)
	}
}
