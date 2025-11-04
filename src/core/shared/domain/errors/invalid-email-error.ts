import { DomainError } from '../base/domain-error'

export class InvalidEmailError extends DomainError {
	constructor(message?: string) {
		super(message || 'E-mail inválido', 400)
	}
}
