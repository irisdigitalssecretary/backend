import { ApplicationError } from '@/core/shared/application/base/application-error'

export class InvalidSessionError extends ApplicationError {
    constructor() {
        super('E-mail e/ou senha inválidos.', 401)
    }
}
