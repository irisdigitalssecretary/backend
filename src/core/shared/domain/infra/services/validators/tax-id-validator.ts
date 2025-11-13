export interface ValidateTaxIdProps {
	countryCode: string
	code: string
}

export abstract class TaxIdValidator {
	public abstract validate(props: ValidateTaxIdProps): boolean | string | null
}
