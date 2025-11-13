export interface ValidateZipCodeProps {
	countryCode: string
	code: string
}

export abstract class ZipCodeValidator {
	public abstract validate(
		props: ValidateZipCodeProps,
	): boolean | string | null
}
