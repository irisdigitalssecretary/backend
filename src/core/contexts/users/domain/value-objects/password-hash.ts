import { ValueObject } from '@shared/domain/base/value-object'
import { Hasher } from '@/core/shared/domain/infra/services/hasher'

interface PasswordHashProps {
	hashedPassword: string
}

export class PasswordHash extends ValueObject<PasswordHashProps> {
	constructor(hashedPassword: string) {
		super({ hashedPassword })
	}

	get hashedPassword(): string {
		return this.props.hashedPassword as string
	}

	public static async create(
		password: string,
		hasher: Hasher,
	): Promise<PasswordHash> {
		const hashedPassword = await hasher.hash(password)
		return new PasswordHash(hashedPassword)
	}
}
