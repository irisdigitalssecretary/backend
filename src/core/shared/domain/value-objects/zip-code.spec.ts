import { ZipCodeValidatorService } from '@/core/shared/infra/services/validators/zip-code-validator.service'
import { ZipCode } from './zip-code'
import { ZipCodeInvalidError } from '../errors/zip-code-invalid-error'
import { ZipCodeRequiredError } from '../errors/zip-code-required-error'

describe('ZipCode', () => {
	let zipCodeValidator: ZipCodeValidatorService

	beforeEach(() => {
		zipCodeValidator = new ZipCodeValidatorService()
	})

	describe('Creation - Valid Cases', () => {
		it('should be able to create a valid zip code from Andorra (AD)', () => {
			const zipCode = ZipCode.create(
				{
					value: 'AD100',
					countryCode: 'AD',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('AD100')
		})

		it('should be able to create a valid zip code from Austria (AT)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1010',
					countryCode: 'AT',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1010')
		})

		it('should be able to create a valid zip code from Australia (AU)', () => {
			const zipCode = ZipCode.create(
				{
					value: '2000',
					countryCode: 'AU',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('2000')
		})

		it('should be able to create a valid zip code from Azerbaijan (AZ)', () => {
			const zipCode = ZipCode.create(
				{
					value: 'AZ1000',
					countryCode: 'AZ',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('AZ1000')
		})

		it('should be able to create a valid zip code from Bosnia and Herzegovina (BA)', () => {
			const zipCode = ZipCode.create(
				{
					value: '71000',
					countryCode: 'BA',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('71000')
		})

		it('should be able to create a valid zip code from Bangladesh (BD)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1000',
					countryCode: 'BD',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1000')
		})

		it('should be able to create a valid zip code from Belgium (BE)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1000',
					countryCode: 'BE',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1000')
		})

		it('should be able to create a valid zip code from Bulgaria (BG)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1000',
					countryCode: 'BG',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1000')
		})

		it('should be able to create a valid zip code from Brazil (BR) with hyphen', () => {
			const zipCode = ZipCode.create(
				{
					value: '12345-678',
					countryCode: 'BR',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('12345-678')
		})

		it('should be able to create a valid zip code from Brazil (BR) without hyphen', () => {
			const zipCode = ZipCode.create(
				{
					value: '12345678',
					countryCode: 'BR',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('12345678')
		})

		it('should be able to create a valid zip code from Belarus (BY)', () => {
			const zipCode = ZipCode.create(
				{
					value: '220050',
					countryCode: 'BY',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('220050')
		})

		it('should be able to create a valid zip code from Canada (CA)', () => {
			const zipCode = ZipCode.create(
				{
					value: 'K1A 0B1',
					countryCode: 'CA',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('K1A 0B1')
		})

		it('should be able to create a valid zip code from Switzerland (CH)', () => {
			const zipCode = ZipCode.create(
				{
					value: '8000',
					countryCode: 'CH',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('8000')
		})

		it('should be able to create a valid zip code from China (CN)', () => {
			const zipCode = ZipCode.create(
				{
					value: '100000',
					countryCode: 'CN',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('100000')
		})

		it('should be able to create a valid zip code from Colombia (CO)', () => {
			const zipCode = ZipCode.create(
				{
					value: '110111',
					countryCode: 'CO',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('110111')
		})

		it('should be able to create a valid zip code from Czech Republic (CZ)', () => {
			const zipCode = ZipCode.create(
				{
					value: '100 00',
					countryCode: 'CZ',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('100 00')
		})

		it('should be able to create a valid zip code from Germany (DE)', () => {
			const zipCode = ZipCode.create(
				{
					value: '12345',
					countryCode: 'DE',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('12345')
		})

		it('should be able to create a valid zip code from Denmark (DK)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1000',
					countryCode: 'DK',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1000')
		})

		it('should be able to create a valid zip code from Dominican Republic (DO)', () => {
			const zipCode = ZipCode.create(
				{
					value: '10101',
					countryCode: 'DO',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('10101')
		})

		it('should be able to create a valid zip code from Algeria (DZ)', () => {
			const zipCode = ZipCode.create(
				{
					value: '16000',
					countryCode: 'DZ',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('16000')
		})

		it('should be able to create a valid zip code from Estonia (EE)', () => {
			const zipCode = ZipCode.create(
				{
					value: '10111',
					countryCode: 'EE',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('10111')
		})

		it('should be able to create a valid zip code from Spain (ES)', () => {
			const zipCode = ZipCode.create(
				{
					value: '28001',
					countryCode: 'ES',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('28001')
		})

		it('should be able to create a valid zip code from Finland (FI)', () => {
			const zipCode = ZipCode.create(
				{
					value: '00100',
					countryCode: 'FI',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('00100')
		})

		it('should be able to create a valid zip code from France (FR)', () => {
			const zipCode = ZipCode.create(
				{
					value: '75001',
					countryCode: 'FR',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('75001')
		})

		it('should be able to create a valid zip code from United Kingdom (GB)', () => {
			const zipCode = ZipCode.create(
				{
					value: 'SW1A 1AA',
					countryCode: 'GB',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('SW1A 1AA')
		})

		it('should be able to create a valid zip code from Greece (GR)', () => {
			const zipCode = ZipCode.create(
				{
					value: '10431',
					countryCode: 'GR',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('10431')
		})

		it('should be able to create a valid zip code from Croatia (HR)', () => {
			const zipCode = ZipCode.create(
				{
					value: '10000',
					countryCode: 'HR',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('10000')
		})

		it('should be able to create a valid zip code from Haiti (HT)', () => {
			const zipCode = ZipCode.create(
				{
					value: 'HT1110',
					countryCode: 'HT',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('HT1110')
		})

		it('should be able to create a valid zip code from Hungary (HU)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1011',
					countryCode: 'HU',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1011')
		})

		it('should be able to create a valid zip code from Indonesia (ID)', () => {
			const zipCode = ZipCode.create(
				{
					value: '10110',
					countryCode: 'ID',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('10110')
		})

		it('should be able to create a valid zip code from Ireland (IE)', () => {
			const zipCode = ZipCode.create(
				{
					value: 'D02 AF30',
					countryCode: 'IE',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('D02 AF30')
		})

		it('should be able to create a valid zip code from Israel (IL)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1029200',
					countryCode: 'IL',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1029200')
		})

		it('should be able to create a valid zip code from India (IN)', () => {
			const zipCode = ZipCode.create(
				{
					value: '110001',
					countryCode: 'IN',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('110001')
		})

		it('should be able to create a valid zip code from Iran (IR)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1345678901',
					countryCode: 'IR',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1345678901')
		})

		it('should be able to create a valid zip code from Iceland (IS)', () => {
			const zipCode = ZipCode.create(
				{
					value: '101',
					countryCode: 'IS',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('101')
		})

		it('should be able to create a valid zip code from Italy (IT)', () => {
			const zipCode = ZipCode.create(
				{
					value: '00118',
					countryCode: 'IT',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('00118')
		})

		it('should be able to create a valid zip code from Japan (JP)', () => {
			const zipCode = ZipCode.create(
				{
					value: '100-0001',
					countryCode: 'JP',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('100-0001')
		})

		it('should be able to create a valid zip code from Kenya (KE)', () => {
			const zipCode = ZipCode.create(
				{
					value: '00100',
					countryCode: 'KE',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('00100')
		})

		it('should be able to create a valid zip code from South Korea (KR)', () => {
			const zipCode = ZipCode.create(
				{
					value: '03051',
					countryCode: 'KR',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('03051')
		})

		it('should be able to create a valid zip code from Liechtenstein (LI)', () => {
			const zipCode = ZipCode.create(
				{
					value: '9490',
					countryCode: 'LI',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('9490')
		})

		it('should be able to create a valid zip code from Lithuania (LT)', () => {
			const zipCode = ZipCode.create(
				{
					value: 'LT-00012',
					countryCode: 'LT',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('LT-00012')
		})

		it('should be able to create a valid zip code from Luxembourg (LU)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1009',
					countryCode: 'LU',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1009')
		})

		it('should be able to create a valid zip code from Latvia (LV)', () => {
			const zipCode = ZipCode.create(
				{
					value: 'LV-1001',
					countryCode: 'LV',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('LV-1001')
		})

		it('should be able to create a valid zip code from Sri Lanka (LK)', () => {
			const zipCode = ZipCode.create(
				{
					value: '10100',
					countryCode: 'LK',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('10100')
		})

		it('should be able to create a valid zip code from Madagascar (MG)', () => {
			const zipCode = ZipCode.create(
				{
					value: '101',
					countryCode: 'MG',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('101')
		})

		it('should be able to create a valid zip code from Mexico (MX)', () => {
			const zipCode = ZipCode.create(
				{
					value: '01000',
					countryCode: 'MX',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('01000')
		})

		it('should be able to create a valid zip code from Malta (MT)', () => {
			const zipCode = ZipCode.create(
				{
					value: 'VLT 1117',
					countryCode: 'MT',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('VLT 1117')
		})

		it('should be able to create a valid zip code from Malaysia (MY)', () => {
			const zipCode = ZipCode.create(
				{
					value: '50000',
					countryCode: 'MY',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('50000')
		})

		it('should be able to create a valid zip code from Netherlands (NL)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1012 AB',
					countryCode: 'NL',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1012 AB')
		})

		it('should be able to create a valid zip code from Norway (NO)', () => {
			const zipCode = ZipCode.create(
				{
					value: '0001',
					countryCode: 'NO',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('0001')
		})

		it('should be able to create a valid zip code from Nepal (NP)', () => {
			const zipCode = ZipCode.create(
				{
					value: '44600',
					countryCode: 'NP',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('44600')
		})

		it('should be able to create a valid zip code from New Zealand (NZ)', () => {
			const zipCode = ZipCode.create(
				{
					value: '0110',
					countryCode: 'NZ',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('0110')
		})

		it('should be able to create a valid zip code from Pakistan (PK)', () => {
			const zipCode = ZipCode.create(
				{
					value: '44000',
					countryCode: 'PK',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('44000')
		})

		it('should be able to create a valid zip code from Poland (PL)', () => {
			const zipCode = ZipCode.create(
				{
					value: '00-001',
					countryCode: 'PL',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('00-001')
		})

		it('should be able to create a valid zip code from Puerto Rico (PR)', () => {
			const zipCode = ZipCode.create(
				{
					value: '00601',
					countryCode: 'PR',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('00601')
		})

		it('should be able to create a valid zip code from Portugal (PT)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1000-001',
					countryCode: 'PT',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1000-001')
		})

		it('should be able to create a valid zip code from Romania (RO)', () => {
			const zipCode = ZipCode.create(
				{
					value: '010001',
					countryCode: 'RO',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('010001')
		})

		it('should be able to create a valid zip code from Russia (RU)', () => {
			const zipCode = ZipCode.create(
				{
					value: '101000',
					countryCode: 'RU',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('101000')
		})

		it('should be able to create a valid zip code from Saudi Arabia (SA)', () => {
			const zipCode = ZipCode.create(
				{
					value: '11564',
					countryCode: 'SA',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('11564')
		})

		it('should be able to create a valid zip code from Sweden (SE)', () => {
			const zipCode = ZipCode.create(
				{
					value: '100 05',
					countryCode: 'SE',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('100 05')
		})

		it('should be able to create a valid zip code from Singapore (SG)', () => {
			const zipCode = ZipCode.create(
				{
					value: '018956',
					countryCode: 'SG',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('018956')
		})

		it('should be able to create a valid zip code from Slovenia (SI)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1000',
					countryCode: 'SI',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1000')
		})

		it('should be able to create a valid zip code from Slovakia (SK)', () => {
			const zipCode = ZipCode.create(
				{
					value: '010 01',
					countryCode: 'SK',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('010 01')
		})

		it('should be able to create a valid zip code from Thailand (TH)', () => {
			const zipCode = ZipCode.create(
				{
					value: '10100',
					countryCode: 'TH',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('10100')
		})

		it('should be able to create a valid zip code from Tunisia (TN)', () => {
			const zipCode = ZipCode.create(
				{
					value: '1001',
					countryCode: 'TN',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('1001')
		})

		it('should be able to create a valid zip code from Taiwan (TW)', () => {
			const zipCode = ZipCode.create(
				{
					value: '100',
					countryCode: 'TW',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('100')
		})

		it('should be able to create a valid zip code from Ukraine (UA)', () => {
			const zipCode = ZipCode.create(
				{
					value: '01001',
					countryCode: 'UA',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('01001')
		})

		it('should be able to create a valid zip code from United States (US) with 5 digits', () => {
			const zipCode = ZipCode.create(
				{
					value: '12345',
					countryCode: 'US',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('12345')
		})

		it('should be able to create a valid zip code from United States (US) with ZIP+4', () => {
			const zipCode = ZipCode.create(
				{
					value: '12345-6789',
					countryCode: 'US',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('12345-6789')
		})

		it('should be able to create a valid zip code from South Africa (ZA)', () => {
			const zipCode = ZipCode.create(
				{
					value: '0001',
					countryCode: 'ZA',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('0001')
		})

		it('should be able to create a valid zip code from Zambia (ZM)', () => {
			const zipCode = ZipCode.create(
				{
					value: '10101',
					countryCode: 'ZM',
				},
				zipCodeValidator,
			)

			expect(zipCode).toBeInstanceOf(ZipCode)
			expect(zipCode.value).toBe('10101')
		})
	})

	describe('Creation - Invalid Cases', () => {
		it('should not be able to create an invalid zip code from Andorra (AD)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345',
						countryCode: 'AD',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Austria (AT)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'AT',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Australia (AU)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12',
						countryCode: 'AU',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Azerbaijan (AZ)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345',
						countryCode: 'AZ',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Bosnia and Herzegovina (BA)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'BA',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Bangladesh (BD)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'BD',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Belgium (BE)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12',
						countryCode: 'BE',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Bulgaria (BG)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'BG',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Brazil (BR) with incorrect format', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'BR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Brazil (BR) with letters', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCDE-FGH',
						countryCode: 'BR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Belarus (BY)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'BY',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Canada (CA)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345',
						countryCode: 'CA',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Switzerland (CH)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'CH',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from China (CN)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'CN',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Colombia (CO)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'CO',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Czech Republic (CZ)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCDE',
						countryCode: 'CZ',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Germany (DE)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCDE',
						countryCode: 'DE',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Denmark (DK)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'DK',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Dominican Republic (DO)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCDE',
						countryCode: 'DO',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Algeria (DZ)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'DZ',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Estonia (EE)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'EE',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Spain (ES)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'ES',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Finland (FI)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'FI',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from France (FR)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'FR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from United Kingdom (GB)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345',
						countryCode: 'GB',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Greece (GR)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'GR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Croatia (HR)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'HR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Haiti (HT)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345',
						countryCode: 'HT',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Hungary (HU)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'HU',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Indonesia (ID)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'ID',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Ireland (IE)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345',
						countryCode: 'IE',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Israel (IL)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'IL',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from India (IN)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'IN',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Iran (IR)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'IR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Iceland (IS)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'IS',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Italy (IT)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'IT',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Japan (JP)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'JP',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Kenya (KE)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCDE',
						countryCode: 'KE',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from South Korea (KR)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'KR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Liechtenstein (LI)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'LI',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Lithuania (LT)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'LT',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Luxembourg (LU)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'LU',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Latvia (LV)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345',
						countryCode: 'LV',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Sri Lanka (LK)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'LK',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Madagascar (MG)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'MG',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Mexico (MX)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'MX',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Malta (MT)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345',
						countryCode: 'MT',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Malaysia (MY)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'MY',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Netherlands (NL)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345',
						countryCode: 'NL',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Norway (NO)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'NO',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Nepal (NP)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'NP',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from New Zealand (NZ)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'NZ',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Pakistan (PK)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'PK',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Poland (PL)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCDE',
						countryCode: 'PL',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Puerto Rico (PR)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'PR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Portugal (PT)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'PT',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Romania (RO)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'RO',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Russia (RU)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'RU',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Saudi Arabia (SA)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'SA',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Sweden (SE)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCDE',
						countryCode: 'SE',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Singapore (SG)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'SG',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Slovenia (SI)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'SI',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Slovakia (SK)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCDE',
						countryCode: 'SK',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Thailand (TH)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'TH',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Tunisia (TN)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'TN',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Taiwan (TW)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'TW',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Ukraine (UA)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'UA',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from United States (US) with incorrect format', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'US',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from United States (US) with letters', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCDE',
						countryCode: 'US',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from United States (US) with 10 digits', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '1234567890',
						countryCode: 'US',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from South Africa (ZA)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: 'ABCD',
						countryCode: 'ZA',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an invalid zip code from Zambia (ZM)', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123',
						countryCode: 'ZM',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create a zip code with only spaces', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '     ',
						countryCode: 'BR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create a zip code with invalid special characters', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '12345@678',
						countryCode: 'BR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})

		it('should not be able to create an extremely long zip code', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '123456789012345678901234567890',
						countryCode: 'BR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeInvalidError)
		})
	})

	describe('Required Field Validation', () => {
		it('should not be able to create a zip code with empty string', () => {
			expect(() => {
				ZipCode.create(
					{
						value: '',
						countryCode: 'BR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeRequiredError)
		})

		it('should not be able to create a zip code with null value', () => {
			expect(() => {
				ZipCode.create(
					{
						value: null as any,
						countryCode: 'BR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeRequiredError)
		})

		it('should not be able to create a zip code with undefined value', () => {
			expect(() => {
				ZipCode.create(
					{
						value: undefined as any,
						countryCode: 'BR',
					},
					zipCodeValidator,
				)
			}).toThrow(ZipCodeRequiredError)
		})
	})
})
