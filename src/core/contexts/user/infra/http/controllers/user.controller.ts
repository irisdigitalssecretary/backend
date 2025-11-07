import {
	Body,
	Controller,
	Post,
	HttpException,
	Put,
	Param,
	ParseIntPipe,
	Patch,
	Delete,
	Get,
	Query,
} from '@nestjs/common'
import { type CreateUserBody, createUserSchema } from '../dtos/create-user.dto'
import { ZodValidationPipe } from '@/core/shared/infra/http/pipes/zod-validation-pipes'
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case'
import { UserViewModel } from '../view-models/user-view-model'
import { type UpdateUserBody, updateUserSchema } from '../dtos/update-user.dto'
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case'
import {
	type UpdateUserSessionStatusBody,
	updateUserSessionStatusSchema,
} from '../dtos/update-user-session-status.dto'
import { UpdateUserSessionStatusUseCase } from '../../../application/use-cases/update-user-session-status.use-case'
import { UpdateUserStatusUseCase } from '../../../application/use-cases/update-user-status.use-case'
import {
	type UpdateUserStatusBody,
	updateUserStatusSchema,
} from '../dtos/update-user-status.dto'
import { DeleteUserByIdUseCase } from '../../../application/use-cases/delete-user-by-id.use-case'
import { FindUserByUuidUseCase } from '../../../application/use-cases/find-user-by-uuid.use-case'
import { FindManyUsersByOffsetPaginationUseCase } from '../../../application/use-cases/find-many-users-by-offset-pagination.use-case'
import {
	type FindManyUsersQuery,
	findManyUsersSchema,
} from '../dtos/find-many-users.dto'
import {
	UserFields,
	UserSelectableFields,
} from '../../../domain/repositories/user-repository'
import { Pagination } from '@/core/shared/application/utils/pagination'

@Controller('users')
export class UserController {
	constructor(
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly updateUserUseCase: UpdateUserUseCase,
		private readonly updateUserSessionStatusUseCase: UpdateUserSessionStatusUseCase,
		private readonly updateUserStatusUseCase: UpdateUserStatusUseCase,
		private readonly deleteUserByIdUseCase: DeleteUserByIdUseCase,
		private readonly findUserByUuidUseCase: FindUserByUuidUseCase,
		private readonly findManyUsersByOffsetPaginationUseCase: FindManyUsersByOffsetPaginationUseCase,
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

	@Patch(':id/session-status')
	async updateSessionStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(updateUserSessionStatusSchema))
		body: UpdateUserSessionStatusBody,
	) {
		const { status } = body

		const result = await this.updateUserSessionStatusUseCase.execute({
			id,
			status,
		})

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}
	}

	@Patch(':id/status')
	async updateStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(updateUserStatusSchema))
		body: UpdateUserStatusBody,
	) {
		const { status } = body

		const result = await this.updateUserStatusUseCase.execute({
			id,
			status,
		})

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}
	}

	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		const result = await this.deleteUserByIdUseCase.execute({ id })

		if (result.isLeft()) {
			throw new HttpException(
				result.value.message,
				result.value.statusCode,
			)
		}
	}

	@Get(':uuid')
	async findByUuid(@Param('uuid') uuid: string) {
		const result = await this.findUserByUuidUseCase.execute({ uuid })

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

	@Get()
	async findMany(
		@Query(new ZodValidationPipe(findManyUsersSchema))
		query: FindManyUsersQuery,
	) {
		const { filters, pagination, orderBy, select } = query

		const result =
			await this.findManyUsersByOffsetPaginationUseCase.execute({
				filters: filters as Partial<UserFields> | undefined,
				pagination: pagination as Pagination,
				orderBy,
				select: select as UserSelectableFields[] | undefined,
			})

		if (result.isLeft()) {
			throw new HttpException('Erro ao buscar usuários', 500)
		}

		return {
			users: result.value.map((user) => UserViewModel.toHTTP(user)),
		}
	}
}
