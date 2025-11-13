import { DomainError } from '../base/domain-error'

export class TaxIdRequiredError extends DomainError {
	constructor() {
		super('Código de identificação fiscal é obrigatório', 400)
	}
}
