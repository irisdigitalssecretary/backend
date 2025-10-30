import { DomainError } from '@/core/shared/domain/base/domain-error'

export class OldPasswordRequiredError extends DomainError {
	constructor() {
		super('A senha atual é obrigatória para atualizar a senha.', 401)
	}
}
