import { DomainError } from '@/core/shared/domain/base/domain-error'

export class UserNotFoundError extends DomainError {
	constructor() {
		super('Usuário não encontrado.', 404)
	}
}
