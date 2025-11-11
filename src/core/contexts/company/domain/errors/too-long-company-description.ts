import { DomainError } from '@/core/shared/domain/base/domain-error'

export class TooLongCompanyDescriptionError extends DomainError {
	constructor() {
		super(
			'A descrição da empresa deve possuir no máximo 255 caracteres.',
			400,
		)
	}
}
