import { DomainError } from '../base/domain-error'

export class InvalidEmailError extends DomainError {
	constructor(message?: string) {
		super(message || 'Email inválido', 400)
	}
}
