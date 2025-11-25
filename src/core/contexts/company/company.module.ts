import { Module } from '@nestjs/common'
import { CompanyController } from './infra/http/controllers/company.controller'
import { CreateCompanyUseCase } from './application/use-cases/create-company.use-case'
import { UpdateCompanyUseCase } from './application/use-cases/update-company.use-case'
import { UpdateCompanyStatusUseCase } from './application/use-cases/update-company-status.use-case'
import { DeleteCompanyByIdUseCase } from './application/use-cases/delete-company-by-id.use-case'
import { FindCompanyByUuidUseCase } from './application/use-cases/find-company-by-uuid.use-case'
import { FindManyCompaniesByOffsetPaginationUseCase } from './application/use-cases/find-many-companies-by-offset-pagination'
import { CompanyRepository } from './domain/repositories/company.repository'
import { PrismaCompanyRepository } from './infra/database/prisma/prisma-company.repository'
import { ZipCodeValidator } from '@/core/shared/domain/infra/services/validators/zip-code-validator'
import { ZipCodeValidatorService } from '@/core/shared/infra/services/validators/zip-code-validator.service'
import { TaxIdValidatorService } from '@/core/shared/infra/services/validators/tax-id-validator.service'
import { TaxIdValidator } from '@/core/shared/domain/infra/services/validators/tax-id-validator'
import { CountryRepository } from '../country/domain/repositories/country.repository'
import { PrismaCountryRepository } from '../country/infra/database/prisma/prisma-country-repository'

@Module({
	controllers: [CompanyController],
	providers: [
		CreateCompanyUseCase,
		UpdateCompanyUseCase,
		UpdateCompanyStatusUseCase,
		DeleteCompanyByIdUseCase,
		FindCompanyByUuidUseCase,
		FindManyCompaniesByOffsetPaginationUseCase,
		{
			provide: CompanyRepository,
			useClass: PrismaCompanyRepository,
		},
		{
			provide: CountryRepository,
			useClass: PrismaCountryRepository,
		},
		{
			provide: ZipCodeValidator,
			useClass: ZipCodeValidatorService,
		},
		{
			provide: TaxIdValidator,
			useClass: TaxIdValidatorService,
		},
	],
})
export class CompanyModule {}
