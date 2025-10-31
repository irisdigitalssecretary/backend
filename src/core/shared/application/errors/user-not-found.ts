import { ApplicationError } from '@/core/shared/application/base/application-error'

export class UserNotFoundError extends ApplicationError {
	constructor() {
		super('Usuário não encontrado.', 404)
	}
}
