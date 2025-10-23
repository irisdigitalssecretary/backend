import { AppError } from '@shared/domain/base/app-error'

export class OldPasswordInvalidError extends AppError {
	constructor() {
		super('A senha atual é inválida.', 401)
	}
}
