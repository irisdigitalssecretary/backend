import { DomainError } from '../base/domain-error'

export class ZipCodeRequiredError extends DomainError {
	constructor() {
		super('Código postal é obrigatório', 400)
	}
}
