import { ValueObject } from '@shared/domain/base/value-object'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { InvalidPasswordError } from '../errors/invalid-password'

interface PasswordHashProps {
	hashedPassword: string
}

export class PasswordHash extends ValueObject<PasswordHashProps> {
	constructor(hashedPassword: string) {
		super({ hashedPassword })
	}

	get hashedPassword(): string {
		return this.props.hashedPassword
	}

	public static async create(
		password: string,
		hasher: Hasher,
	): Promise<PasswordHash> {
		this.validate(password)
		const hashedPassword = await hasher.hash(password)
		return new PasswordHash(hashedPassword)
	}

	private static validate(password: string): void {
		if (password.length < 8) {
			throw new InvalidPasswordError(
				'Senha deve ter pelo menos 8 caracteres.',
			)
		}

		if (!/[A-Z]/.test(password)) {
			throw new InvalidPasswordError(
				'Senha deve conter pelo menos uma letra maiúscula.',
			)
		}

		if (!/\d/.test(password)) {
			throw new InvalidPasswordError(
				'Senha deve conter pelo menos um número.',
			)
		}

		if (!/[!@#$%^&*]/.test(password)) {
			throw new InvalidPasswordError(
				'Senha deve conter pelo menos um caractere especial.',
			)
		}
	}
}
