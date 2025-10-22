import { AppError } from '../base/app-error'

export class InvalidEmailError extends AppError {
	constructor(message?: string) {
		super(message || 'Email inválido', 400)
	}
}
