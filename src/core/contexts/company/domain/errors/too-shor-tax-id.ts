import { DomainError } from '@/core/shared/domain/base/domain-error'

export class TooShortTaxIdError extends DomainError {
	constructor() {
		super(
			'O código de identificação fiscal (CPF, CNPJ, SSN e etc.) deve possuir no mínimo 5 caracteres.',
			400,
		)
	}
}
