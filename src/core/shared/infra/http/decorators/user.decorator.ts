import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface UserContext {
	id: string
	companyId: number
	roles: string[]
	isMaster: boolean
}

export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): UserContext => {
		const request = ctx.switchToHttp().getRequest()
		return request.user as UserContext
	},
)
