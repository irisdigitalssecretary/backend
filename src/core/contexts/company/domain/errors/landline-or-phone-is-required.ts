import { DomainError } from '@/core/shared/domain/base/domain-error'

export class LandlineOrPhoneIsRequiredError extends DomainError {
	constructor() {
		super(
			'O telefone fixo ou o telefone celular da empresa é obrigatório.',
			400,
		)
	}
}
