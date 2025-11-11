import { DomainError } from '@/core/shared/domain/base/domain-error'

export class TooShortCompanyDescriptionError extends DomainError {
	constructor() {
		super(
			'A descrição da empresa deve possuir no mínimo 20 caracteres.',
			400,
		)
	}
}
