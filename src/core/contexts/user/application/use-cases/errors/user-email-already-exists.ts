import { ApplicationError } from '@/core/shared/application/errors/application-error'

export class UserEmailExistsError extends ApplicationError {
	constructor() {
		super('Já existe um usuário com este email cadastrado', 409)
	}
}
