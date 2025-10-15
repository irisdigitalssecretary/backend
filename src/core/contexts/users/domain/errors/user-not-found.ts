import { AppError } from '@shared/domain/base/app-error'

export class UserNotFoundError extends AppError {
	constructor() {
		super('Usuário não encontrado.', 404)
	}
}
