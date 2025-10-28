import { DomainError } from '@/core/shared/domain/base/domain-error'

export class UserEmailExistsError extends DomainError {
	constructor() {
		super('Já existe um usuário com este email cadastrado', 409)
	}
}
