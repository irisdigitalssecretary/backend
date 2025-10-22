import { ValueObject } from '../base/value-object'
import { InvalidPhoneError } from '../errors/invalid-phone'

export class Phone extends ValueObject<{ value: string }> {
	public static readonly REGEX_PATTERN =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	constructor(phone: string) {
		super({ value: phone })
	}

	get value(): string {
		return this.props.value
	}

	public static create(phone: string): Phone {
		this.validate(phone)

		return new Phone(phone)
	}

	private static validate(phone: string): void {
		if (phone.length < 10) {
			throw new InvalidPhoneError(
				'Telefone deve possuir no mínimo 10 caracteres.',
			)
		}

		if (phone.length > 16) {
			throw new InvalidPhoneError(
				'Telefone deve possuir no máximo 16 caracteres.',
			)
		}
	}
}
