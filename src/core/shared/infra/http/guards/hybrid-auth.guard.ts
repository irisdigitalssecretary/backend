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
import { JwtTokenGeneratorService } from '../../services/token/jwt-token-generator.service'
import { SEVEN_DAYS_IN_SECONDS } from '@/core/shared/application/constants/days-in-seconds'

const UNAUTHORIZED_MESSAGE = 'Unauthorized access'
const MASTER_COMPANY_ID = 0

interface Payload {
	companyId: number
	isMaster: boolean
}

@Injectable()
export class HybridAuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly jwtGenerator: JwtTokenGeneratorService
	) { }

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const http = ctx.switchToHttp()
		const request = http.getRequest()
		const response = http.getResponse()

		const authHeader = request.headers['authorization']
		const [, secretOrJwt] = authHeader
			? authHeader.split('Bearer ')
			: ['', '']

		const authConfig = this.reflector.getAllAndOverride<AuthConfig>(
			AUTH_CONFIG_KEY,
			[ctx.getHandler(), ctx.getClass()],
		)

		if (!secretOrJwt) throw new UnauthorizedException(UNAUTHORIZED_MESSAGE)

		const MASTER_SECRET = env.MASTER_LOCAL_TESTS_KEY

		if (MASTER_SECRET && (MASTER_SECRET === secretOrJwt)) {
			this.setAutomatedTestingUser(request)
			return true
		}

		try {
			const payload = await this.jwtGenerator.verify(secretOrJwt)

			HybridAuthGuard.validateOnlyMastersCanAccess(payload, authConfig)

			request.user = payload

			return true
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error
			}

			return await this.tryGenerateRefreshToken(request, response, authConfig)
		}
	}

	private async tryGenerateRefreshToken(request: any, response: any, authConfig: AuthConfig) {
		const refresToken = request.cookies?.['refresh_token']

		if (!refresToken) throw new UnauthorizedException(UNAUTHORIZED_MESSAGE)

		try {
			const payload = await this.jwtGenerator.verify(refresToken)

			HybridAuthGuard.validateOnlyMastersCanAccess(payload, authConfig)

			const payloadNewToken = {
				id: payload.id,
				companyId: payload.companyId,
				isMaster: payload.isMaster
			}

			const newAccessToken = await this.jwtGenerator.sign(payloadNewToken)
			const newRefreshToken = await this.jwtGenerator.sign(payloadNewToken, {
				expiresIn: SEVEN_DAYS_IN_SECONDS
			})

			response.cookie('refresh_token', newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
				path: '/',
			})

			response.setHeader('x-new-access-token', newAccessToken);
			response.setHeader('Access-Control-Expose-Headers', 'x-new-access-token');

			request.user = payload
			return true
		} catch (_error) {
			throw new UnauthorizedException(UNAUTHORIZED_MESSAGE)
		}
	}

	private static validateOnlyMastersCanAccess(payload: Payload, authConfig: AuthConfig) {
		if (!payload.isMaster && authConfig?.onlyMastersCanAccess) throw new UnauthorizedException(UNAUTHORIZED_MESSAGE)
	}

	private setAutomatedTestingUser(request: any) {
		const companyId = request.headers['x-company-id'] || 1;
		request.user = {
			id: 'system-master',
			isMaster: true,
			companyId: Number(companyId),
		};
	}
}
