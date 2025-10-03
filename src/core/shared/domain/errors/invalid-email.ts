import { AppError } from '../base/app-error'

export class InvalidEmailError extends AppError {
	constructor() {
		super('Email inválido', 400)
	}
}
