import { DomainError } from '../base/domain-error'

export class ZipCodeInvalidError extends DomainError {
	constructor() {
		super('Código postal inválido', 400)
	}
}
