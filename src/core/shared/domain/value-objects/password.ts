import { ValueObject } from '@shared/domain/base/value-object'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'
import { InvalidPasswordError } from '../errors/invalid-password-error'

interface PasswordProps {
	hashedPassword: string
}

export class Password extends ValueObject<PasswordProps> {
	constructor(hashedPassword: string) {
		super({ hashedPassword })
	}

	get hashedPassword(): string {
		return this.props.hashedPassword
	}

	public static restore(password: string): Password {
		return new Password(password)
	}

	public static async create(
		password: string,
		hasher?: Hasher,
	): Promise<Password | undefined> {
		if (!hasher) return undefined

		this.validate(password)
		const hashedPassword = await hasher.hash(password)
		return new Password(hashedPassword)
	}

	private static validate(password: string): void {
		if (password.length < 8) {
			throw new InvalidPasswordError(
				'Senha deve possuir no mínimo 8 caracteres.',
			)
		}

		if (!/[A-Z]/.test(password)) {
			throw new InvalidPasswordError(
				'Senha deve possuir pelo menos uma letra maiúscula.',
			)
		}

		if (!/\d/.test(password)) {
			throw new InvalidPasswordError(
				'Senha deve possuir pelo menos um número.',
			)
		}

		if (!/[!@#$%^&*]/.test(password)) {
			throw new InvalidPasswordError(
				'Senha deve possuir pelo menos um caractere especial.',
			)
		}

		if (password.length > 16) {
			throw new InvalidPasswordError(
				'Senha deve possuir no máximo 16 caracteres.',
			)
		}
	}
}
