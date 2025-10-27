import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Inject,
} from '@nestjs/common'
import { type CreateUserBody, createUserSchema } from '../dtos/create-user.dto'
import { ZodValidationPipe } from '@/core/shared/infra/pipes/zod-validation-pipes'
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case'
import { UserViewModel } from '../view-models/user-view-model'

@Controller('users')
export class UserController {
	constructor(
		@Inject(CreateUserUseCase)
		private readonly createUserUseCase: CreateUserUseCase,
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
			throw new BadRequestException(result.value.message)
		}

		return {
			user: UserViewModel.toHTTP(result.value),
		}
	}
}
