import { Body, Controller, HttpException, Post, Put } from '@nestjs/common'
import { CreateCompanyUseCase } from '../../../application/use-cases/create-company.use-case'
import { ZodValidationPipe } from '@/core/shared/infra/http/pipes/zod-validation-pipes'
import {
	type CreateCompanyBody,
	createCompanySchema,
} from '../dtos/create-company.dto'
import { CompanyViewModel } from '../view-models/company-view-model'

@Controller('companies')
export class CompanyController {
	constructor(private readonly createCompanyUseCase: CreateCompanyUseCase) {}

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

	// @Put(':id')
	// async update(
	// 	@Param('id', ParseIntPipe) id: number,
	// 	@Body(new ZodValidationPipe(updateCompanySchema))
	// 	body: UpdateCompanyBody,
	// ) {}
}
