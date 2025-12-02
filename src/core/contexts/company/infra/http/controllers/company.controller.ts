import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
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
import { FindCompanyByUuidUseCase } from '../../../application/use-cases/find-company-by-uuid.use-case'
import { DeleteCompanyByIdUseCase } from '../../../application/use-cases/delete-company-by-id.use-case'
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

@Controller('companies')
export class CompanyController {
	constructor(
		private readonly createCompanyUseCase: CreateCompanyUseCase,
		private readonly updateCompanyUseCase: UpdateCompanyUseCase,
		private readonly updateCompanyStatusUseCase: UpdateCompanyStatusUseCase,
		private readonly findCompanyByUuidUseCase: FindCompanyByUuidUseCase,
		private readonly deleteCompanyByIdUseCase: DeleteCompanyByIdUseCase,
		private readonly findManyCompaniesByOffsetPaginationUseCase: FindManyCompaniesByOffsetPaginationUseCase,
	) {}

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

	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(updateCompanySchema))
		body: UpdateCompanyBody,
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
			id,
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

	@Patch(':id/status')
	async updateStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(updateCompanyStatusSchema))
		body: UpdateCompanyStatusBody,
	) {
		const { status } = body

		const result = await this.updateCompanyStatusUseCase.execute({
			id,
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

	@Get(':uuid')
	async findByUuid(@Param('uuid') uuid: string) {
		const result = await this.findCompanyByUuidUseCase.execute({ uuid })

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

	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		const result = await this.deleteCompanyByIdUseCase.execute(id)

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}
	}

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
