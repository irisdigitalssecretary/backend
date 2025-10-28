import { DomainError } from '../base/domain-error'

export class InvalidPasswordError extends DomainError {
	constructor(message?: string) {
		super(message || 'Senha inválida', 400)
	}
}
