import { DomainError } from '@/core/shared/domain/base/domain-error'

export class TooShortCompanyAdressError extends DomainError {
	constructor() {
		super(
			'A endereço da empresa deve possuir no mínimo 20 caracteres.',
			400,
		)
	}
}
