import { ValueObject } from '@/core/shared/domain/base/value-object'
import { TaxIdRequiredError } from '../errors/tax-id-required'
import { TooShortTaxIdError } from '../errors/too-shor-tax-id'

export class TaxId extends ValueObject<{ value: string }> {
	constructor(value: string) {
		super({ value })
	}

	public static create(value: string): TaxId {
		this.validate(value)

		return new TaxId(value)
	}

	private static validate(value: string): void {
		if (!value) {
			throw new TaxIdRequiredError()
		}

		if (value.length < 5) {
			throw new TooShortTaxIdError()
		}
	}
}
