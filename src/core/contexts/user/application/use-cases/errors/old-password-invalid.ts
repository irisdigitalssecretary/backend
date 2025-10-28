import { DomainError } from '@/core/shared/domain/base/domain-error'

export class OldPasswordInvalidError extends DomainError {
	constructor() {
		super('A senha atual é inválida.', 401)
	}
}
