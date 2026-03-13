import { SetMetadata } from '@nestjs/common'

export interface AuthConfig {
	onlyMastersCanAccess: boolean
}

export const AUTH_CONFIG_KEY = 'authConfig'

export const AuthOptions = (config: Partial<AuthConfig>) =>
	SetMetadata(AUTH_CONFIG_KEY, config)
