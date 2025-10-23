import { AppError } from '@shared/domain/base/app-error'

export class UserEmailExistsError extends AppError {
	constructor() {
		super('Já existe um usuário com este email cadastrado', 409)
	}
}
