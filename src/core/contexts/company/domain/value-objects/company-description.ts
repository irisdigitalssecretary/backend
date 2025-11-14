import { ValueObject } from '@/core/shared/domain/base/value-object'
import { TooLongCompanyDescriptionError } from '../errors/too-long-company-description'
import { TooShortCompanyDescriptionError } from '../errors/too-short-company-description'

export class CompanyDescription extends ValueObject<{ value: string }> {
	constructor(value: string) {
		super({ value })
	}

	public get value(): string {
		return this.props.value
	}

	public static restore(value: string): CompanyDescription {
		return new CompanyDescription(value)
	}

	public static create(value: string): CompanyDescription {
		this.validate(value)

		return new CompanyDescription(value)
	}

	private static validate(value: string): void {
		if (value.length < 20) {
			throw new TooShortCompanyDescriptionError()
		}
		if (value.length > 255) {
			throw new TooLongCompanyDescriptionError()
		}
	}
}
