import { ApplicationError } from '@/core/shared/application/base/application-error'

export class CompanyNotFoundError extends ApplicationError {
	constructor() {
		super('Empresa não encontrada.', 404)
	}
}
