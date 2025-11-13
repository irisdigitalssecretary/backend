import { TaxIdValidatorService } from './tax-id-validator.service'

describe('TaxIdValidatorService', () => {
	let taxIdValidator: TaxIdValidatorService

	beforeEach(() => {
		taxIdValidator = new TaxIdValidatorService()
	})

	describe('TaxID Validation - Valid Cases', () => {
		// === AMÉRICAS ===
		it('should validate a valid CUIT from Argentina (AR)', () => {
			const result = taxIdValidator.validate({
				code: '20123456786',
				countryCode: 'AR',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid CPF from Brazil (BR)', () => {
			const result = taxIdValidator.validate({
				code: '15225632963',
				countryCode: 'BR',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid CNPJ from Brazil (BR)', () => {
			const result = taxIdValidator.validate({
				code: '01894147000135',
				countryCode: 'BR',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid SIN from Canada (CA)', () => {
			const result = taxIdValidator.validate({
				code: '123456782',
				countryCode: 'CA',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid EIN from United States (US)', () => {
			const result = taxIdValidator.validate({
				code: '12-3456789',
				countryCode: 'US',
			})

			expect(result).toBe(true)
		})

		// === EUROPA ===
		it('should validate a valid Steuer-IdNr from Germany (DE)', () => {
			const result = taxIdValidator.validate({
				code: '12345678911',
				countryCode: 'DE',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Abgabenkontonummer from Austria (AT)', () => {
			const result = taxIdValidator.validate({
				code: '111111118',
				countryCode: 'AT',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Numéro national from Belgium (BE_FR)', () => {
			const result = taxIdValidator.validate({
				code: '85011512355',
				countryCode: 'BE',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid EGN from Bulgaria (BG)', () => {
			const result = taxIdValidator.validate({
				code: '7523169263',
				countryCode: 'BG',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid AFM from Cyprus (CY)', () => {
			const result = taxIdValidator.validate({
				code: '90000000Y',
				countryCode: 'CY',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid OIB from Croatia (HR)', () => {
			const result = taxIdValidator.validate({
				code: '12345678903',
				countryCode: 'HR',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid CPR-nummer from Denmark (DK)', () => {
			const result = taxIdValidator.validate({
				code: 'DK12345678',
				countryCode: 'DK',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Rodné číslo from Czech Republic (CZ)', () => {
			const result = taxIdValidator.validate({
				code: '7103192745',
				countryCode: 'CZ',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Isikukood from Estonia (EE)', () => {
			const result = taxIdValidator.validate({
				code: '37605030299',
				countryCode: 'EE',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Henkilötunnus from Finland (FI)', () => {
			const result = taxIdValidator.validate({
				code: '131052-308T',
				countryCode: 'FI',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Numéro fiscal from France (FR)', () => {
			const result = taxIdValidator.validate({
				code: '1000000000083',
				countryCode: 'FR',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid AFM from Greece (GR)', () => {
			const result = taxIdValidator.validate({
				code: '123456783',
				countryCode: 'GR',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Adóazonosító jel from Hungary (HU)', () => {
			const result = taxIdValidator.validate({
				code: '8000000008',
				countryCode: 'HU',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid PPS No from Ireland (IE)', () => {
			const result = taxIdValidator.validate({
				code: '1234567T',
				countryCode: 'IE',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Codice Fiscale from Italy (IT)', () => {
			const result = taxIdValidator.validate({
				code: 'RSSMRA80A01H501U',
				countryCode: 'IT',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Personas kods from Latvia (LV)', () => {
			const result = taxIdValidator.validate({
				code: '01019010001',
				countryCode: 'LV',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Asmens kodas from Lithuania (LT)', () => {
			const result = taxIdValidator.validate({
				code: '37605030299',
				countryCode: 'LT',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Tax ID from Luxembourg (LU_FR)', () => {
			const result = taxIdValidator.validate({
				code: '123456789',
				countryCode: 'LU_FR',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Identity Card Number from Malta (MT)', () => {
			const result = taxIdValidator.validate({
				code: 'MT12345678',
				countryCode: 'MT',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid BSN from Netherlands (NL)', () => {
			const result = taxIdValidator.validate({
				code: '123456782',
				countryCode: 'NL',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid PESEL from Poland (PL)', () => {
			const result = taxIdValidator.validate({
				code: '05211012341',
				countryCode: 'PL',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid NIF from Portugal (PT)', () => {
			const result = taxIdValidator.validate({
				code: '123456789',
				countryCode: 'PT',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid NINO from United Kingdom (GB)', () => {
			const result = taxIdValidator.validate({
				code: 'AB123456C',
				countryCode: 'GB',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid CNP from Romania (RO)', () => {
			const result = taxIdValidator.validate({
				code: '5050110010015',
				countryCode: 'RO',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Rodné číslo from Slovakia (SK)', () => {
			const result = taxIdValidator.validate({
				code: '123456/789',
				countryCode: 'SK',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Davčna številka from Slovenia (SI)', () => {
			const result = taxIdValidator.validate({
				code: '12345679',
				countryCode: 'SI',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid DNI from Spain (ES)', () => {
			const result = taxIdValidator.validate({
				code: '12345678Z',
				countryCode: 'ES',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid Personnummer from Sweden (SE)', () => {
			const result = taxIdValidator.validate({
				code: '900110-1238',
				countryCode: 'SE',
			})

			expect(result).toBe(true)
		})

		it('should validate a valid RNTRC from Ukraine (UA)', () => {
			const result = taxIdValidator.validate({
				code: '1234567899',
				countryCode: 'UA',
			})

			expect(result).toBe(true)
		})
	})

	describe('TaxID Validation - Invalid Cases', () => {
		it('should invalidate an invalid CPF from Brazil (BR)', () => {
			const result = taxIdValidator.validate({
				code: '123.456.789-00',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid CNPJ from Brazil (BR)', () => {
			const result = taxIdValidator.validate({
				code: '11.222.333/0001-00',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid EIN from United States (US)', () => {
			const result = taxIdValidator.validate({
				code: '12-345678',
				countryCode: 'US',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid CUIT from Argentina (AR)', () => {
			const result = taxIdValidator.validate({
				code: '12345678',
				countryCode: 'AR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Steuer-IdNr from Germany (DE)', () => {
			const result = taxIdValidator.validate({
				code: '12345',
				countryCode: 'DE',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Abgabenkontonummer from Austria (AT)', () => {
			const result = taxIdValidator.validate({
				code: '12345',
				countryCode: 'AT',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Numéro national from Belgium (BE)', () => {
			const result = taxIdValidator.validate({
				code: '12345',
				countryCode: 'BE_FR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid EGN from Bulgaria (BG)', () => {
			const result = taxIdValidator.validate({
				code: '12345',
				countryCode: 'BG',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid DNI from Spain (ES)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'ES',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Numéro fiscal from France (FR)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'FR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Codice Fiscale from Italy (IT)', () => {
			const result = taxIdValidator.validate({
				code: 'INVALID',
				countryCode: 'IT',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid BSN from Netherlands (NL)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'NL',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid PESEL from Poland (PL)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'PL',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid NIF from Portugal (PT)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'PT',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid NINO from United Kingdom (GB)', () => {
			const result = taxIdValidator.validate({
				code: 'GB123',
				countryCode: 'GB',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an empty Tax ID', () => {
			const result = taxIdValidator.validate({
				code: '',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate a Tax ID with only spaces', () => {
			const result = taxIdValidator.validate({
				code: '     ',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate a Tax ID with invalid special characters', () => {
			const result = taxIdValidator.validate({
				code: '12345@678',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an extremely long Tax ID', () => {
			const result = taxIdValidator.validate({
				code: '123456789012345678901234567890',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid OIB from Croatia (HR)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'HR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid AFM from Cyprus (CY)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'CY',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Rodné číslo from Czech Republic (CZ)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'CZ',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid CPR-nummer from Denmark (DK)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'DK',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Isikukood from Estonia (EE)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'EE',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Henkilötunnus from Finland (FI)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'FI',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid AFM from Greece (GR)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'GR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Adóazonosító jel from Hungary (HU)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'HU',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid PPS No from Ireland (IE)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'IE',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Personas kods from Latvia (LV)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'LV',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Asmens kodas from Lithuania (LT)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'LT',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Tax ID from Luxembourg (LU)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'LU_FR',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Identity Card Number from Malta (MT)', () => {
			const result = taxIdValidator.validate({
				code: '12',
				countryCode: 'MT',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid CNP from Romania (RO)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'RO',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Rodné číslo from Slovakia (SK)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'SK',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Davčna številka from Slovenia (SI)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'SI',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid Personnummer from Sweden (SE)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'SE',
			})

			expect(result).toBe(false)
		})

		it('should invalidate an invalid RNTRC from Ukraine (UA)', () => {
			const result = taxIdValidator.validate({
				code: '123',
				countryCode: 'UA',
			})

			expect(result).toBe(false)
		})
	})
})
