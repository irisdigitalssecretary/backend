import { DomainError } from '../base/domain-error'

export class InvalidLandlineError extends DomainError {
	constructor(message?: string) {
		super(message || 'Telefone fixo inválido', 400)
	}
}
