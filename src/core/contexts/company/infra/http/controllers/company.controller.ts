import {
	Body,
	Controller,
	Get,
	HttpException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common'
import { CreateCompanyUseCase } from '../../../application/use-cases/create-company.use-case'
import { ZodValidationPipe } from '@/core/shared/infra/http/pipes/zod-validation-pipes'
import {
	type CreateCompanyBody,
	createCompanySchema,
} from '../dtos/create-company.dto'
import { CompanyViewModel } from '../view-models/company-view-model'
import {
	type UpdateCompanyBody,
	updateCompanySchema,
} from '../dtos/update-company.dto'
import { UpdateCompanyUseCase } from '../../../application/use-cases/update-company.use-case'
import {
	type UpdateCompanyStatusBody,
	updateCompanyStatusSchema,
} from '../dtos/update-company-status.dto'
import { UpdateCompanyStatusUseCase } from '../../../application/use-cases/update-company-status.use-case'
import { FindCompanyByIdUseCase } from '../../../application/use-cases/find-company-by-id.use-case'
import {
	CompanyFields,
	CompanySelectableFields,
} from '../../../domain/repositories/company.repository'
import { Pagination } from '@/core/shared/application/utils/pagination'
import { FindManyCompaniesByOffsetPaginationUseCase } from '../../../application/use-cases/find-many-companies-by-offset-pagination'
import {
	type FindManyCompaniesQuery,
	findManyCompaniesSchema,
} from '../dtos/find-many-companies.dto'
import { HybridAuthGuard } from '@/core/shared/infra/http/guards/hybrid-auth.guard'
import { AuthOptions } from '@/core/shared/infra/http/decorators/auth-config.decorator'
import { User, type UserContext } from '@/core/shared/infra/http/decorators/user.decorator'

@UseGuards(HybridAuthGuard)
@Controller('companies')
export class CompanyController {
	constructor(
		private readonly createCompanyUseCase: CreateCompanyUseCase,
		private readonly updateCompanyUseCase: UpdateCompanyUseCase,
		private readonly updateCompanyStatusUseCase: UpdateCompanyStatusUseCase,
		private readonly findCompanyByIdUseCase: FindCompanyByIdUseCase,
		private readonly findManyCompaniesByOffsetPaginationUseCase: FindManyCompaniesByOffsetPaginationUseCase,
	) { }

	@Put()
	async update(
		@Body(new ZodValidationPipe(updateCompanySchema))
		body: UpdateCompanyBody,
		@User() user: UserContext
	) {
		const { companyId } = user
		const {
			name,
			email,
			landline,
			phone,
			taxId,
			address,
			zip,
			city,
			state,
			description,
			businessArea,
			personType,
			status,
			countryCode,
		} = body

		const result = await this.updateCompanyUseCase.execute(
			{
				name,
				email,
				landline,
				phone,
				taxId,
				address,
				zip,
				city,
				state,
				description,
				businessArea,
				personType,
				status,
				countryCode,
			},
			companyId,
		)

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}

		return {
			company: CompanyViewModel.toHTTP(result.value),
		}
	}

	@Patch('/status')
	async updateStatus(
		@Body(new ZodValidationPipe(updateCompanyStatusSchema))
		body: UpdateCompanyStatusBody,
		@User() user: UserContext
	) {
		const { status } = body
		const { companyId } = user

		const result = await this.updateCompanyStatusUseCase.execute({
			id: companyId,
			status,
		})

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}

		return {
			company: CompanyViewModel.toHTTP(result.value),
		}
	}

	@Get('/my-company')
	async findByUserCompanyId(@User() user: UserContext) {
		const { companyId } = user
		const result = await this.findCompanyByIdUseCase.execute({ id: companyId })

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}

		return {
			company: CompanyViewModel.toHTTP(result.value),
		}
	}

	/**
	 * SOMENTE MASTERS / PAINEL ADMINISTRATIVO
	 */
	@AuthOptions({ onlyMastersCanAccess: true })
	@Post()
	async create(
		@Body(new ZodValidationPipe(createCompanySchema))
		body: CreateCompanyBody,
	) {
		const {
			name,
			email,
			landline,
			phone,
			taxId,
			address,
			zip,
			city,
			state,
			description,
			businessArea,
			personType,
			status,
			countryCode,
		} = body

		const result = await this.createCompanyUseCase.execute({
			name,
			email,
			landline,
			phone,
			taxId,
			address,
			zip,
			city,
			state,
			description,
			businessArea,
			personType,
			status,
			countryCode,
		})

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}

		return {
			company: CompanyViewModel.toHTTP(result.value),
		}
	}

	@AuthOptions({ onlyMastersCanAccess: true })
	@Get(':id')
	async findById(@Param('id', ParseIntPipe) id: number) {
		const result = await this.findCompanyByIdUseCase.execute({ id })

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}

		return {
			company: CompanyViewModel.toHTTP(result.value),
		}
	}

	@AuthOptions({ onlyMastersCanAccess: true })
	@Get()
	async findMany(
		@Query(new ZodValidationPipe(findManyCompaniesSchema))
		query: FindManyCompaniesQuery,
	) {
		const { filters, pagination, orderBy, select } = query

		const result =
			await this.findManyCompaniesByOffsetPaginationUseCase.execute({
				filters: filters as CompanyFields,
				pagination: pagination as Pagination,
				orderBy,
				select: select as CompanySelectableFields[] | undefined,
			})

		if (result.isLeft()) {
			throw new HttpException('Erro ao buscar empresas', 500)
		}

		return {
			companies: result.value.map((company) =>
				CompanyViewModel.toHTTP(company),
			),
		}
	}
}
