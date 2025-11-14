import { ValueObject } from '../base/value-object'
import { InvalidPhoneError } from '../errors/invalid-phone-error'

export class Phone extends ValueObject<{ value: string }> {
	constructor(phone: string) {
		super({ value: phone })
	}

	get value(): string {
		return this.props.value
	}

	public static restore(phone: string): Phone {
		return new Phone(phone)
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
