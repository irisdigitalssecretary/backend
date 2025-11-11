import { ValueObject } from '../base/value-object'
import { InvalidLandlineError } from '../errors/invalid-landline-error'

export class Landline extends ValueObject<{ value: string }> {
	constructor(landline: string) {
		super({ value: landline })
	}

	get value(): string {
		return this.props.value
	}

	public static fromString(landline: string): Landline {
		return new Landline(landline)
	}

	public static create(landline: string): Landline {
		this.validate(landline)

		return new Landline(landline)
	}

	private static validate(landline: string): void {
		if (landline.length < 10) {
			throw new InvalidLandlineError(
				'Telefone fixo deve possuir no mínimo 10 caracteres.',
			)
		}

		if (landline.length > 16) {
			throw new InvalidLandlineError(
				'Telefone fixo deve possuir no máximo 16 caracteres.',
			)
		}
	}
}
