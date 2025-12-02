import { z } from 'zod'
import { CompanyStatus } from '@/core/shared/domain/constants/company/company-status.enum'

export const updateCompanyStatusSchema = z.object({
	status: z.enum(CompanyStatus, 'Status inválido'),
})

export type UpdateCompanyStatusBody = z.infer<typeof updateCompanyStatusSchema>
