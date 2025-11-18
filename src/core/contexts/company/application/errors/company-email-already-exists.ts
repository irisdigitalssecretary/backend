import { ApplicationError } from '@/core/shared/application/base/application-error'

export class CompanyEmailAlreadyExistsError extends ApplicationError {
	constructor() {
		super('Já existe uma empresa com este email cadastrado', 409)
	}
}
