import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { env } from '../../config/env-validation'
import { Reflector } from '@nestjs/core'
import {
	AUTH_CONFIG_KEY,
	AuthConfig,
} from '../decorators/auth-config.decorator'

export const UNAUTHORIZED_MESSAGE = 'Unauthorized access'

@Injectable()
export class HybridAuthGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(ctx: ExecutionContext): boolean {
		const request = ctx.switchToHttp().getRequest()
		const authHeader = request.headers['authorization']
		const [, secretOrJwt] = authHeader
			? authHeader.split('Bearer ')
			: ['', '']
		const authConfig = this.reflector.getAllAndOverride<AuthConfig>(
			AUTH_CONFIG_KEY,
			[ctx.getHandler(), ctx.getClass()],
		)

		if (!secretOrJwt) throw new UnauthorizedException(UNAUTHORIZED_MESSAGE)

		const MASTER_SECRET = env.MASTER_KEY

		if (MASTER_SECRET === secretOrJwt) {
			const companyId = request.headers['x-company-id'] as number

			if (!companyId)
				throw new UnauthorizedException(UNAUTHORIZED_MESSAGE)

			request.user = {
				id: 'system-master',
				roles: ['MASTER'],
				isMaster: true,
				companyId: companyId,
			}

			return true
		}

		const allowJwt = authConfig?.allowJwt ?? true

		if (!allowJwt) {
			throw new UnauthorizedException(UNAUTHORIZED_MESSAGE)
		}

		return true
	}
}
