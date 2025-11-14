import { TaxIdValidatorService } from '@/core/shared/infra/services/validators/tax-id-validator.service'
import { TaxIdInvalidError } from '@/core/shared/domain/errors/tax-id-invalid-error'
import { TaxIdRequiredError } from '@/core/shared/domain/errors/tax-id-required-error'
import { TaxId } from './tax-id'

describe('TaxId', () => {
	let taxIdValidator: TaxIdValidatorService

	beforeEach(() => {
		taxIdValidator = new TaxIdValidatorService()
	})

	describe('TaxID Validation - Valid Cases', () => {
		// === AMÉRICAS ===
		it('should create a valid TaxId with CUIT from Argentina (AR)', () => {
			const taxId = TaxId.create(
				{
					code: '20123456786',
					countryCode: 'AR',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('20123456786')
		})

		it('should create a valid TaxId with CPF from Brazil (BR)', () => {
			const taxId = TaxId.create(
				{
					code: '15225632963',
					countryCode: 'BR',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('15225632963')
		})

		it('should create a valid TaxId with CNPJ from Brazil (BR)', () => {
			const taxId = TaxId.create(
				{
					code: '01894147000135',
					countryCode: 'BR',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('01894147000135')
		})

		it('should create a valid TaxId with SIN from Canada (CA)', () => {
			const taxId = TaxId.create(
				{
					code: '123456782',
					countryCode: 'CA',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('123456782')
		})

		it('should create a valid TaxId with EIN from United States (US)', () => {
			const taxId = TaxId.create(
				{
					code: '12-3456789',
					countryCode: 'US',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('12-3456789')
		})

		// === EUROPA ===
		it('should create a valid TaxId with Steuer-IdNr from Germany (DE)', () => {
			const taxId = TaxId.create(
				{
					code: '12345678911',
					countryCode: 'DE',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('12345678911')
		})

		it('should create a valid TaxId with Abgabenkontonummer from Austria (AT)', () => {
			const taxId = TaxId.create(
				{
					code: '111111118',
					countryCode: 'AT',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('111111118')
		})

		it('should create a valid TaxId with Numéro national from Belgium (BE_FR)', () => {
			const taxId = TaxId.create(
				{
					code: '85011512355',
					countryCode: 'BE',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('85011512355')
		})

		it('should create a valid TaxId with EGN from Bulgaria (BG)', () => {
			const taxId = TaxId.create(
				{
					code: '7523169263',
					countryCode: 'BG',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('7523169263')
		})

		it('should create a valid TaxId with AFM from Cyprus (CY)', () => {
			const taxId = TaxId.create(
				{
					code: '90000000Y',
					countryCode: 'CY',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('90000000Y')
		})

		it('should create a valid TaxId with OIB from Croatia (HR)', () => {
			const taxId = TaxId.create(
				{
					code: '12345678903',
					countryCode: 'HR',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('12345678903')
		})

		it('should create a valid TaxId with CPR-nummer from Denmark (DK)', () => {
			const taxId = TaxId.create(
				{
					code: 'DK12345678',
					countryCode: 'DK',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('DK12345678')
		})

		it('should create a valid TaxId with Rodné číslo from Czech Republic (CZ)', () => {
			const taxId = TaxId.create(
				{
					code: '7103192745',
					countryCode: 'CZ',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('7103192745')
		})

		it('should create a valid TaxId with Isikukood from Estonia (EE)', () => {
			const taxId = TaxId.create(
				{
					code: '37605030299',
					countryCode: 'EE',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('37605030299')
		})

		it('should create a valid TaxId with Henkilötunnus from Finland (FI)', () => {
			const taxId = TaxId.create(
				{
					code: '131052-308T',
					countryCode: 'FI',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('131052-308T')
		})

		it('should create a valid TaxId with Numéro fiscal from France (FR)', () => {
			const taxId = TaxId.create(
				{
					code: '1000000000083',
					countryCode: 'FR',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('1000000000083')
		})

		it('should create a valid TaxId with AFM from Greece (GR)', () => {
			const taxId = TaxId.create(
				{
					code: '123456783',
					countryCode: 'GR',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('123456783')
		})

		it('should create a valid TaxId with Adóazonosító jel from Hungary (HU)', () => {
			const taxId = TaxId.create(
				{
					code: '8000000008',
					countryCode: 'HU',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('8000000008')
		})

		it('should create a valid TaxId with PPS No from Ireland (IE)', () => {
			const taxId = TaxId.create(
				{
					code: '1234567T',
					countryCode: 'IE',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('1234567T')
		})

		it('should create a valid TaxId with Codice Fiscale from Italy (IT)', () => {
			const taxId = TaxId.create(
				{
					code: 'RSSMRA80A01H501U',
					countryCode: 'IT',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('RSSMRA80A01H501U')
		})

		it('should create a valid TaxId with Personas kods from Latvia (LV)', () => {
			const taxId = TaxId.create(
				{
					code: '01019010001',
					countryCode: 'LV',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('01019010001')
		})

		it('should create a valid TaxId with Asmens kodas from Lithuania (LT)', () => {
			const taxId = TaxId.create(
				{
					code: '37605030299',
					countryCode: 'LT',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('37605030299')
		})

		it('should create a valid TaxId with Tax ID from Luxembourg (LU_FR)', () => {
			const taxId = TaxId.create(
				{
					code: '123456789',
					countryCode: 'LU_FR',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('123456789')
		})

		it('should create a valid TaxId with Identity Card Number from Malta (MT)', () => {
			const taxId = TaxId.create(
				{
					code: 'MT12345678',
					countryCode: 'MT',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('MT12345678')
		})

		it('should create a valid TaxId with BSN from Netherlands (NL)', () => {
			const taxId = TaxId.create(
				{
					code: '123456782',
					countryCode: 'NL',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('123456782')
		})

		it('should create a valid TaxId with PESEL from Poland (PL)', () => {
			const taxId = TaxId.create(
				{
					code: '05211012341',
					countryCode: 'PL',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('05211012341')
		})

		it('should create a valid TaxId with NIF from Portugal (PT)', () => {
			const taxId = TaxId.create(
				{
					code: '123456789',
					countryCode: 'PT',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('123456789')
		})

		it('should create a valid TaxId with NINO from United Kingdom (GB)', () => {
			const taxId = TaxId.create(
				{
					code: 'AB123456C',
					countryCode: 'GB',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('AB123456C')
		})

		it('should create a valid TaxId with CNP from Romania (RO)', () => {
			const taxId = TaxId.create(
				{
					code: '5050110010015',
					countryCode: 'RO',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('5050110010015')
		})

		it('should create a valid TaxId with Rodné číslo from Slovakia (SK)', () => {
			const taxId = TaxId.create(
				{
					code: '123456/789',
					countryCode: 'SK',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('123456/789')
		})

		it('should create a valid TaxId with Davčna številka from Slovenia (SI)', () => {
			const taxId = TaxId.create(
				{
					code: '12345679',
					countryCode: 'SI',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('12345679')
		})

		it('should create a valid TaxId with DNI from Spain (ES)', () => {
			const taxId = TaxId.create(
				{
					code: '12345678Z',
					countryCode: 'ES',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('12345678Z')
		})

		it('should create a valid TaxId with Personnummer from Sweden (SE)', () => {
			const taxId = TaxId.create(
				{
					code: '900110-1238',
					countryCode: 'SE',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('900110-1238')
		})

		it('should create a valid TaxId with RNTRC from Ukraine (UA)', () => {
			const taxId = TaxId.create(
				{
					code: '1234567899',
					countryCode: 'UA',
				},
				taxIdValidator,
			)

			expect(taxId).toBeInstanceOf(TaxId)
			expect(taxId.props.code).toBe('1234567899')
		})
	})

	describe('TaxID Validation - Invalid Cases', () => {
		it('should throw TaxIdInvalidError for invalid CPF from Brazil (BR)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123.456.789-00',
						countryCode: 'BR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid CNPJ from Brazil (BR)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '11.222.333/0001-00',
						countryCode: 'BR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid EIN from United States (US)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '12-345678',
						countryCode: 'US',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid CUIT from Argentina (AR)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '12345678',
						countryCode: 'AR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Steuer-IdNr from Germany (DE)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '12345',
						countryCode: 'DE',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Abgabenkontonummer from Austria (AT)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '12345',
						countryCode: 'AT',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Numéro national from Belgium (BE)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '12345',
						countryCode: 'BE_FR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid EGN from Bulgaria (BG)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '12345',
						countryCode: 'BG',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid DNI from Spain (ES)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'ES',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Numéro fiscal from France (FR)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'FR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Codice Fiscale from Italy (IT)', () => {
			expect(() => {
				TaxId.create(
					{
						code: 'INVALID',
						countryCode: 'IT',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid BSN from Netherlands (NL)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'NL',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid PESEL from Poland (PL)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'PL',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid NIF from Portugal (PT)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'PT',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid NINO from United Kingdom (GB)', () => {
			expect(() => {
				TaxId.create(
					{
						code: 'GB123',
						countryCode: 'GB',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdRequiredError for empty Tax ID', () => {
			expect(() => {
				TaxId.create(
					{
						code: '',
						countryCode: 'BR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdRequiredError)
		})

		it('should throw TaxIdRequiredError for Tax ID with only spaces', () => {
			expect(() => {
				TaxId.create(
					{
						code: '     ',
						countryCode: 'BR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdRequiredError)
		})

		it('should throw TaxIdInvalidError for Tax ID with invalid special characters', () => {
			expect(() => {
				TaxId.create(
					{
						code: '12345@678',
						countryCode: 'BR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for extremely long Tax ID', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123456789012345678901234567890',
						countryCode: 'BR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid OIB from Croatia (HR)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'HR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid AFM from Cyprus (CY)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'CY',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Rodné číslo from Czech Republic (CZ)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'CZ',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid CPR-nummer from Denmark (DK)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'DK',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Isikukood from Estonia (EE)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'EE',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Henkilötunnus from Finland (FI)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'FI',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid AFM from Greece (GR)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'GR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Adóazonosító jel from Hungary (HU)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'HU',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid PPS No from Ireland (IE)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'IE',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Personas kods from Latvia (LV)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'LV',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Asmens kodas from Lithuania (LT)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'LT',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Tax ID from Luxembourg (LU)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'LU_FR',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Identity Card Number from Malta (MT)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '12',
						countryCode: 'MT',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid CNP from Romania (RO)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'RO',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Rodné číslo from Slovakia (SK)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'SK',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Davčna številka from Slovenia (SI)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'SI',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid Personnummer from Sweden (SE)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'SE',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})

		it('should throw TaxIdInvalidError for invalid RNTRC from Ukraine (UA)', () => {
			expect(() => {
				TaxId.create(
					{
						code: '123',
						countryCode: 'UA',
					},
					taxIdValidator,
				)
			}).toThrow(TaxIdInvalidError)
		})
	})
})
