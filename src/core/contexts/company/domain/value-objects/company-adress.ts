import { ValueObject } from '@/core/shared/domain/base/value-object'
import { TooShortCompanyAdressError } from '../errors/too-short-company-address'
import { TooLongCompanyAdressError } from '../errors/too-long-company-address'

export class CompanyAdress extends ValueObject<{ value: string }> {
	constructor(value: string) {
		super({ value })
	}

	public get value(): string {
		return this.props.value
	}

	public static restore(value: string): CompanyAdress {
		return new CompanyAdress(value)
	}

	public static create(value: string): CompanyAdress {
		this.validate(value)

		return new CompanyAdress(value)
	}

	private static validate(value: string): void {
		if (value.length < 20) {
			throw new TooShortCompanyAdressError()
		}
		if (value.length > 255) {
			throw new TooLongCompanyAdressError()
		}
	}
}
