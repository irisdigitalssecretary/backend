import { TaxIdLocaleEnum } from '@/core/shared/domain/constants/taxId/tax-id-locale.enum'
import {
	ValidateTaxIdProps,
	TaxIdValidator,
} from '@/core/shared/domain/infra/services/validators/tax-id-validator'
import { Injectable } from '@nestjs/common'
import validator, { VATCountryCode } from 'validator'

@Injectable()
export class TaxIdValidatorService implements TaxIdValidator {
	public validate(props: ValidateTaxIdProps): boolean {
		const taxIdLocale = TaxIdLocaleEnum[props.countryCode]

		try {
			return validator.isTaxID(props.code, taxIdLocale)
		} catch {
			return validator.isVAT(
				props.code,
				props.countryCode as VATCountryCode,
			)
		}
	}
}
