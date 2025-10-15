import { AppError } from '@shared/domain/base/app-error'

export class OldPasswordRequiredError extends AppError {
	constructor() {
		super('A senha atual é obrigatória para atualizar a senha.', 401)
	}
}
