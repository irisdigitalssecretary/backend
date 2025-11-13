import { ValueObject } from '@/core/shared/domain/base/value-object'
import { TaxIdInvalidError } from '@/core/shared/domain/errors/tax-id-invalid-error'
import { TaxIdRequiredError } from '@/core/shared/domain/errors/tax-id-required-error'

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
			throw new TaxIdInvalidError()
		}
	}
}
