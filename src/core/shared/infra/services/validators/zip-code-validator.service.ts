import {
	ValidateZipCodeProps,
	ZipCodeValidator,
} from '@/core/shared/domain/infra/services/validators/zip-code-validator'
import { Injectable } from '@nestjs/common'
import validator, { PostalCodeLocale } from 'validator'

@Injectable()
export class ZipCodeValidatorService implements ZipCodeValidator {
	public validate(props: ValidateZipCodeProps): boolean {
		return validator.isPostalCode(
			props.code,
			props.countryCode as PostalCodeLocale,
		)
	}
}
