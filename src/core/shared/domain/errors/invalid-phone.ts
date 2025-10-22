import { AppError } from '../base/app-error'

export class InvalidPhoneError extends AppError {
	constructor(message?: string) {
		super(message || 'Telefone inválido', 400)
	}
}
