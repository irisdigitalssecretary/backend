import { DomainError } from '@/core/shared/domain/base/domain-error'

export class TaxIdRequiredError extends DomainError {
	constructor() {
		super(
			'O código de identificação fiscal (CPF, CNPJ, SSN e etc.) é obrigatório.',
			400,
		)
	}
}
