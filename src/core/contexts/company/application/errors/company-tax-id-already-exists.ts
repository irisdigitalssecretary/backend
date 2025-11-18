import { ApplicationError } from '@/core/shared/application/base/application-error'

export class CompanyTaxIdAlreadyExistsError extends ApplicationError {
	constructor() {
		super('Já existe uma empresa com este código fiscal cadastrado', 409)
	}
}
