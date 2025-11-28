import { z } from 'zod'
import { PersonType } from '@/core/shared/domain/constants/company/person-type.enum'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'
import { TaxIdIso2Enum } from '@/core/shared/domain/constants/taxId/tax-id-iso2.enum'

export const updateCompanySchema = z.object({
	name: z
		.string()
		.min(1, 'Nome é obrigatório.')
		.transform((value) => value?.trim()),
	email: z
		.email('E-mail inválido.')
		.max(100, 'E-mail deve possuir no máximo 100 caracteres.')
		.transform((value) => value?.trim()),
	landline: z
		.string()
		.min(10, 'Telefone fixo deve possuir no mínimo 10 caracteres.')
		.max(16, 'Telefone fixo deve possuir no máximo 16 caracteres.')
		.optional()
		.transform((value) => value?.trim().replace(/[^0-9]/g, '')),
	phone: z
		.string()
		.min(10, 'Telefone deve possuir no mínimo 10 caracteres.')
		.max(16, 'Telefone deve possuir no máximo 16 caracteres.')
		.optional()
		.transform((value) => value?.trim().replace(/[^0-9]/g, '')),
	taxId: z
		.string('Código de identificação fiscal inválido.')
		.min(1, 'Código de identificação fiscal é obrigatório.')
		.transform((value) => value?.trim().replace(/[^a-zA-Z0-9]/g, '')),
	address: z
		.string()
		.min(10, 'O endereço da empresa deve possuir no mínimo 10 caracteres.')
		.max(
			255,
			'O endereço da empresa deve possuir no máximo 255 caracteres.',
		)
		.transform((value) => value?.trim()),
	zip: z
		.string()
		.min(1, 'Código postal é obrigatório.')
		.transform((value) => value?.trim().replace(/[^a-zA-Z0-9]/g, '')),
	city: z
		.string()
		.min(1, 'Cidade é obrigatória.')
		.transform((value) => value?.trim()),
	state: z
		.string()
		.min(1, 'Estado é obrigatório.')
		.transform((value) => value?.trim()),
	description: z
		.string()
		.min(20, 'A descrição da empresa deve possuir no mínimo 20 caracteres.')
		.max(
			255,
			'A descrição da empresa deve possuir no máximo 255 caracteres.',
		)
		.optional(),
	businessArea: z
		.string()
		.min(1, 'Área de negócios é obrigatória.')
		.transform((value) => value?.trim()),
	personType: z.enum(PersonType, 'Tipo de pessoa inválido.'),
	status: z.enum(CompanyStatus, 'Status inválido').optional(),
	countryCode: z
		.enum(TaxIdIso2Enum, 'Código de país inválido')
		.transform((value) => value?.trim().toUpperCase()),
})

export type UpdateCompanyBody = z.infer<typeof updateCompanySchema>
