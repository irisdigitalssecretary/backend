import { ValueObject } from '../base/value-object'

export class Email extends ValueObject<{ value: string }> {
	public static readonly REGEX_PATTERN =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	constructor(email: string) {
		super({ value: email })
	}

	get value(): string {
		return this.props.value
	}

	public static create(email: string): Email {
		if (!this.validate(email)) {
			throw new Error(`Invalid email ${email ? `: ${email}` : ''}`)
		}

		return new Email(email)
	}

	private static validate(email: string): boolean {
		if (!email) return false

		return this.REGEX_PATTERN.test(String(email).toLowerCase())
	}
}
