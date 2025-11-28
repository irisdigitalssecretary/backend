import { DomainError } from '@/core/shared/domain/base/domain-error'

export class TooLongCompanyAdressError extends DomainError {
	constructor() {
		super(
			'O endereço da empresa deve possuir no máximo 255 caracteres.',
			400,
		)
	}
}
