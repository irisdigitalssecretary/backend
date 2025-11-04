import {
	Body,
	Controller,
	Post,
	HttpException,
	Put,
	Param,
	ParseIntPipe,
} from '@nestjs/common'
import { type CreateUserBody, createUserSchema } from '../dtos/create-user.dto'
import { ZodValidationPipe } from '@/core/shared/infra/http/pipes/zod-validation-pipes'
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case'
import { UserViewModel } from '../view-models/user-view-model'
import { type UpdateUserBody, updateUserSchema } from '../dtos/update-user.dto'
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case'

@Controller('users')
export class UserController {
	constructor(
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly updateUserUseCase: UpdateUserUseCase,
	) {}

	@Post()
	async create(
		@Body(new ZodValidationPipe(createUserSchema)) body: CreateUserBody,
	) {
		const { name, email, password, phone } = body

		const result = await this.createUserUseCase.execute({
			name,
			email,
			password,
			phone,
		})

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}

		return {
			user: UserViewModel.toHTTP(result.value),
		}
	}

	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserBody,
	) {
		const {
			name,
			email,
			password,
			phone,
			oldPassword,
			sessionStatus,
			status,
		} = body

		const result = await this.updateUserUseCase.execute(
			{
				name,
				email,
				password,
				phone,
				oldPassword,
				sessionStatus,
				status,
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
			user: UserViewModel.toHTTP(result.value),
		}
	}
}
