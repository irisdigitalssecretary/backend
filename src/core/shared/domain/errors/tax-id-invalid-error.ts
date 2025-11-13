import { DomainError } from '../base/domain-error'

export class TaxIdInvalidError extends DomainError {
	constructor(message?: string) {
		super(message || 'Código de identificação fiscal inválido', 400)
	}
}
