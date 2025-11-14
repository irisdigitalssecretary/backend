import { ValueObject } from '@/core/shared/domain/base/value-object'
import { TaxIdInvalidError } from '@/core/shared/domain/errors/tax-id-invalid-error'
import { TaxIdRequiredError } from '@/core/shared/domain/errors/tax-id-required-error'
import { TaxIdValidator } from '@/core/shared/domain/infra/services/validators/tax-id-validator'

export interface TaxIdProps {
	code: string
	countryCode?: string
}

export class TaxId extends ValueObject<TaxIdProps> {
	private constructor(props: TaxIdProps) {
		super(props)
	}

	public get value(): string {
		return this.props.code
	}

	public static restore(code: string): TaxId {
		return new TaxId({ code })
	}

	public static create(props: TaxIdProps, validator: TaxIdValidator): TaxId {
		this.validate(props, validator)

		return new TaxId(props)
	}

	private static validate(
		props: TaxIdProps,
		validator: TaxIdValidator,
	): void {
		if (!props.code || !props.code.trim()) {
			throw new TaxIdRequiredError()
		}

		if (!props.countryCode || !props.countryCode.trim()) {
			throw new TaxIdRequiredError()
		}

		const isValid = validator.validate({
			code: props.code,
			countryCode: props.countryCode,
		})

		if (!isValid) {
			throw new TaxIdInvalidError()
		}
	}
}
