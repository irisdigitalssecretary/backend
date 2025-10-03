import { AppError } from '../base/app-error'

export class InvalidPasswordError extends AppError {
	constructor(message?: string) {
		super(message || 'Senha inválida', 400)
	}
}
