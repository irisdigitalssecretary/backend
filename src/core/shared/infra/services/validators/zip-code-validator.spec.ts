import { ZipCodeValidatorService } from './zip-code-validator.service'

describe('ZipCodeValidatorService', () => {
	let zipCodeValidator: ZipCodeValidatorService

	beforeEach(() => {
		zipCodeValidator = new ZipCodeValidatorService()
	})

	describe('Validation - Valid Cases', () => {
		it('should be able to validate a valid postal code from Andorra (AD)', () => {
			const result = zipCodeValidator.validate({
				code: 'AD100',
				countryCode: 'AD',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Austria (AT)', () => {
			const result = zipCodeValidator.validate({
				code: '1010',
				countryCode: 'AT',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Australia (AU)', () => {
			const result = zipCodeValidator.validate({
				code: '2000',
				countryCode: 'AU',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Azerbaijan (AZ)', () => {
			const result = zipCodeValidator.validate({
				code: 'AZ1000',
				countryCode: 'AZ',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Bosnia and Herzegovina (BA)', () => {
			const result = zipCodeValidator.validate({
				code: '71000',
				countryCode: 'BA',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Bangladesh (BD)', () => {
			const result = zipCodeValidator.validate({
				code: '1000',
				countryCode: 'BD',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Belgium (BE)', () => {
			const result = zipCodeValidator.validate({
				code: '1000',
				countryCode: 'BE',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Bulgaria (BG)', () => {
			const result = zipCodeValidator.validate({
				code: '1000',
				countryCode: 'BG',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Brazil (BR) with hyphen', () => {
			const result = zipCodeValidator.validate({
				code: '12345-678',
				countryCode: 'BR',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Brazil (BR) without hyphen', () => {
			const result = zipCodeValidator.validate({
				code: '12345678',
				countryCode: 'BR',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Belarus (BY)', () => {
			const result = zipCodeValidator.validate({
				code: '220050',
				countryCode: 'BY',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Canada (CA)', () => {
			const result = zipCodeValidator.validate({
				code: 'K1A 0B1',
				countryCode: 'CA',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Switzerland (CH)', () => {
			const result = zipCodeValidator.validate({
				code: '8000',
				countryCode: 'CH',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from China (CN)', () => {
			const result = zipCodeValidator.validate({
				code: '100000',
				countryCode: 'CN',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Colombia (CO)', () => {
			const result = zipCodeValidator.validate({
				code: '110111',
				countryCode: 'CO',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Czech Republic (CZ)', () => {
			const result = zipCodeValidator.validate({
				code: '100 00',
				countryCode: 'CZ',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Germany (DE)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'DE',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Denmark (DK)', () => {
			const result = zipCodeValidator.validate({
				code: '1000',
				countryCode: 'DK',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Dominican Republic (DO)', () => {
			const result = zipCodeValidator.validate({
				code: '10101',
				countryCode: 'DO',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Algeria (DZ)', () => {
			const result = zipCodeValidator.validate({
				code: '16000',
				countryCode: 'DZ',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Estonia (EE)', () => {
			const result = zipCodeValidator.validate({
				code: '10111',
				countryCode: 'EE',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Spain (ES)', () => {
			const result = zipCodeValidator.validate({
				code: '28001',
				countryCode: 'ES',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Finland (FI)', () => {
			const result = zipCodeValidator.validate({
				code: '00100',
				countryCode: 'FI',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from France (FR)', () => {
			const result = zipCodeValidator.validate({
				code: '75001',
				countryCode: 'FR',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from United Kingdom (GB)', () => {
			const result = zipCodeValidator.validate({
				code: 'SW1A 1AA',
				countryCode: 'GB',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Greece (GR)', () => {
			const result = zipCodeValidator.validate({
				code: '10431',
				countryCode: 'GR',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Croatia (HR)', () => {
			const result = zipCodeValidator.validate({
				code: '10000',
				countryCode: 'HR',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Haiti (HT)', () => {
			const result = zipCodeValidator.validate({
				code: 'HT1110',
				countryCode: 'HT',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Hungary (HU)', () => {
			const result = zipCodeValidator.validate({
				code: '1011',
				countryCode: 'HU',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Indonesia (ID)', () => {
			const result = zipCodeValidator.validate({
				code: '10110',
				countryCode: 'ID',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Ireland (IE)', () => {
			const result = zipCodeValidator.validate({
				code: 'D02 AF30',
				countryCode: 'IE',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Israel (IL)', () => {
			const result = zipCodeValidator.validate({
				code: '1029200',
				countryCode: 'IL',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from India (IN)', () => {
			const result = zipCodeValidator.validate({
				code: '110001',
				countryCode: 'IN',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Iran (IR)', () => {
			const result = zipCodeValidator.validate({
				code: '1345678901',
				countryCode: 'IR',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Iceland (IS)', () => {
			const result = zipCodeValidator.validate({
				code: '101',
				countryCode: 'IS',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Italy (IT)', () => {
			const result = zipCodeValidator.validate({
				code: '00118',
				countryCode: 'IT',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Japan (JP)', () => {
			const result = zipCodeValidator.validate({
				code: '100-0001',
				countryCode: 'JP',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Kenya (KE)', () => {
			const result = zipCodeValidator.validate({
				code: '00100',
				countryCode: 'KE',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from South Korea (KR)', () => {
			const result = zipCodeValidator.validate({
				code: '03051',
				countryCode: 'KR',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Liechtenstein (LI)', () => {
			const result = zipCodeValidator.validate({
				code: '9490',
				countryCode: 'LI',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Lithuania (LT)', () => {
			const result = zipCodeValidator.validate({
				code: 'LT-00012',
				countryCode: 'LT',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Luxembourg (LU)', () => {
			const result = zipCodeValidator.validate({
				code: '1009',
				countryCode: 'LU',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Latvia (LV)', () => {
			const result = zipCodeValidator.validate({
				code: 'LV-1001',
				countryCode: 'LV',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Sri Lanka (LK)', () => {
			const result = zipCodeValidator.validate({
				code: '10100',
				countryCode: 'LK',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Madagascar (MG)', () => {
			const result = zipCodeValidator.validate({
				code: '101',
				countryCode: 'MG',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Mexico (MX)', () => {
			const result = zipCodeValidator.validate({
				code: '01000',
				countryCode: 'MX',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Malta (MT)', () => {
			const result = zipCodeValidator.validate({
				code: 'VLT 1117',
				countryCode: 'MT',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Malaysia (MY)', () => {
			const result = zipCodeValidator.validate({
				code: '50000',
				countryCode: 'MY',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Netherlands (NL)', () => {
			const result = zipCodeValidator.validate({
				code: '1012 AB',
				countryCode: 'NL',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Norway (NO)', () => {
			const result = zipCodeValidator.validate({
				code: '0001',
				countryCode: 'NO',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Nepal (NP)', () => {
			const result = zipCodeValidator.validate({
				code: '44600',
				countryCode: 'NP',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from New Zealand (NZ)', () => {
			const result = zipCodeValidator.validate({
				code: '0110',
				countryCode: 'NZ',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Pakistan (PK)', () => {
			const result = zipCodeValidator.validate({
				code: '44000',
				countryCode: 'PK',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Poland (PL)', () => {
			const result = zipCodeValidator.validate({
				code: '00-001',
				countryCode: 'PL',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Puerto Rico (PR)', () => {
			const result = zipCodeValidator.validate({
				code: '00601',
				countryCode: 'PR',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Portugal (PT)', () => {
			const result = zipCodeValidator.validate({
				code: '1000-001',
				countryCode: 'PT',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Romania (RO)', () => {
			const result = zipCodeValidator.validate({
				code: '010001',
				countryCode: 'RO',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Russia (RU)', () => {
			const result = zipCodeValidator.validate({
				code: '101000',
				countryCode: 'RU',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Saudi Arabia (SA)', () => {
			const result = zipCodeValidator.validate({
				code: '11564',
				countryCode: 'SA',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Sweden (SE)', () => {
			const result = zipCodeValidator.validate({
				code: '100 05',
				countryCode: 'SE',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Singapore (SG)', () => {
			const result = zipCodeValidator.validate({
				code: '018956',
				countryCode: 'SG',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Slovenia (SI)', () => {
			const result = zipCodeValidator.validate({
				code: '1000',
				countryCode: 'SI',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Slovakia (SK)', () => {
			const result = zipCodeValidator.validate({
				code: '010 01',
				countryCode: 'SK',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Thailand (TH)', () => {
			const result = zipCodeValidator.validate({
				code: '10100',
				countryCode: 'TH',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Tunisia (TN)', () => {
			const result = zipCodeValidator.validate({
				code: '1001',
				countryCode: 'TN',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Taiwan (TW)', () => {
			const result = zipCodeValidator.validate({
				code: '100',
				countryCode: 'TW',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Ukraine (UA)', () => {
			const result = zipCodeValidator.validate({
				code: '01001',
				countryCode: 'UA',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from United States (US) with 5 digits', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'US',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from United States (US) with ZIP+4', () => {
			const result = zipCodeValidator.validate({
				code: '12345-6789',
				countryCode: 'US',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from South Africa (ZA)', () => {
			const result = zipCodeValidator.validate({
				code: '0001',
				countryCode: 'ZA',
			})

			expect(result).toBe(true)
		})

		it('should be able to validate a valid postal code from Zambia (ZM)', () => {
			const result = zipCodeValidator.validate({
				code: '10101',
				countryCode: 'ZM',
			})

			expect(result).toBe(true)
		})
	})

	describe('Invalidation - Invalid Cases', () => {
		it('should be able to invalidate an invalid postal code from Andorra (AD)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'AD',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Austria (AT)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'AT',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Australia (AU)', () => {
			const result = zipCodeValidator.validate({
				code: '12',
				countryCode: 'AU',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Azerbaijan (AZ)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'AZ',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Bosnia and Herzegovina (BA)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'BA',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Bangladesh (BD)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'BD',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Belgium (BE)', () => {
			const result = zipCodeValidator.validate({
				code: '12',
				countryCode: 'BE',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Bulgaria (BG)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'BG',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Brazil (BR) with incorrect format', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Brazil (BR) with letters', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCDE-FGH',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an empty postal code from Brazil (BR)', () => {
			const result = zipCodeValidator.validate({
				code: '',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Belarus (BY)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'BY',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Canada (CA)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'CA',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Switzerland (CH)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'CH',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from China (CN)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'CN',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Colombia (CO)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'CO',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Czech Republic (CZ)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCDE',
				countryCode: 'CZ',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Germany (DE)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCDE',
				countryCode: 'DE',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Denmark (DK)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'DK',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Dominican Republic (DO)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCDE',
				countryCode: 'DO',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Algeria (DZ)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'DZ',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Estonia (EE)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'EE',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Spain (ES)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'ES',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Finland (FI)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'FI',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from France (FR)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'FR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from United Kingdom (GB)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'GB',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Greece (GR)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'GR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Croatia (HR)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'HR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Haiti (HT)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'HT',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Hungary (HU)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'HU',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Indonesia (ID)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'ID',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Ireland (IE)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'IE',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Israel (IL)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'IL',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from India (IN)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'IN',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Iran (IR)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'IR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Iceland (IS)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'IS',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Italy (IT)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'IT',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Japan (JP)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'JP',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Kenya (KE)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCDE',
				countryCode: 'KE',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from South Korea (KR)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'KR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Liechtenstein (LI)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'LI',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Lithuania (LT)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'LT',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Luxembourg (LU)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'LU',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Latvia (LV)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'LV',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Sri Lanka (LK)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'LK',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Madagascar (MG)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'MG',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Mexico (MX)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'MX',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Malta (MT)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'MT',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Malaysia (MY)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'MY',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Netherlands (NL)', () => {
			const result = zipCodeValidator.validate({
				code: '12345',
				countryCode: 'NL',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Norway (NO)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'NO',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Nepal (NP)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'NP',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from New Zealand (NZ)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'NZ',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Pakistan (PK)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'PK',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Poland (PL)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCDE',
				countryCode: 'PL',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Puerto Rico (PR)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'PR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Portugal (PT)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'PT',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Romania (RO)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'RO',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Russia (RU)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'RU',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Saudi Arabia (SA)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'SA',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Sweden (SE)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCDE',
				countryCode: 'SE',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Singapore (SG)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'SG',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Slovenia (SI)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'SI',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Slovakia (SK)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCDE',
				countryCode: 'SK',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Thailand (TH)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'TH',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Tunisia (TN)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'TN',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Taiwan (TW)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'TW',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Ukraine (UA)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'UA',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from United States (US) with incorrect format', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'US',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from United States (US) with letters', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCDE',
				countryCode: 'US',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from United States (US) with 10 digits', () => {
			const result = zipCodeValidator.validate({
				code: '1234567890',
				countryCode: 'US',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from South Africa (ZA)', () => {
			const result = zipCodeValidator.validate({
				code: 'ABCD',
				countryCode: 'ZA',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an invalid postal code from Zambia (ZM)', () => {
			const result = zipCodeValidator.validate({
				code: '123',
				countryCode: 'ZM',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate a postal code with only spaces', () => {
			const result = zipCodeValidator.validate({
				code: '     ',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate a postal code with invalid special characters', () => {
			const result = zipCodeValidator.validate({
				code: '12345@678',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})

		it('should be able to invalidate an extremely long postal code', () => {
			const result = zipCodeValidator.validate({
				code: '123456789012345678901234567890',
				countryCode: 'BR',
			})

			expect(result).toBe(false)
		})
	})
})
