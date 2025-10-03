import { ValueObject } from '../base/value-object'
import { InvalidEmailError } from '../errors/invalid-email'

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
		this.validate(email)

		return new Email(email)
	}

	private static validate(email: string): void {
		if (!this.REGEX_PATTERN.test(String(email).toLowerCase())) {
			throw new InvalidEmailError()
		}
	}
}
