import { ValueObject } from '../base/value-object'
import { ZipCodeInvalidError } from '../errors/zip-code-invalid-error'
import { ZipCodeRequiredError } from '../errors/zip-code-required-error'
import { ZipCodeValidator } from '../infra/services/validators/zip-code-validator'

interface CreateZipCodeProps {
	value: string
	countryCode: string
}

export class ZipCode extends ValueObject {
	constructor(value: string) {
		super({ value })
	}

	get value(): string {
		return this.props.value
	}

	public static create(
		props: CreateZipCodeProps,
		zipCodeValidator: ZipCodeValidator,
	): ZipCode {
		this.validate(props, zipCodeValidator)
		return new ZipCode(props.value)
	}

	private static validate(
		props: CreateZipCodeProps,
		zipCodeValidator: ZipCodeValidator,
	): void {
		const { value, countryCode } = props

		if (!value) {
			throw new ZipCodeRequiredError()
		}

		if (
			!zipCodeValidator.validate({
				countryCode,
				code: value,
			})
		) {
			throw new ZipCodeInvalidError()
		}
	}
}
