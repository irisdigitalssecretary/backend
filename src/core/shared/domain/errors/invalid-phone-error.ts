import { DomainError } from '../base/domain-error'

export class InvalidPhoneError extends DomainError {
	constructor(message?: string) {
		super(message || 'Telefone inválido', 400)
	}
}
