import { DomainError } from '@/core/shared/domain/base/domain-error'

export class TooShortCompanyAdressError extends DomainError {
	constructor() {
		super(
			'O endereço da empresa deve possuir no mínimo 10 caracteres.',
			400,
		)
	}
}
