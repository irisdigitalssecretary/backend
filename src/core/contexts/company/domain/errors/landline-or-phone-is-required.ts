import { DomainError } from '@/core/shared/domain/base/domain-error'

export class LandlineOrPhoneIsRequiredError extends DomainError {
	constructor() {
		super(
			'É necessário informar o telefone fixo ou o telefone celular da empresa.',
			400,
		)
	}
}
