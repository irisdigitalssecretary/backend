import { Email } from '@/core/shared/domain/value-objects/email'
import { Entity } from '@shared/domain/base/entity'
import { PasswordHash } from '../value-objects/password-hash'

enum SessionStatus {
	ONLINE = 'online',
	AWAY = 'away',
	BUSY = 'busy',
	OFFLINE = 'offline',
}

interface UserEntityProps {
	name: string
	email: Email
	password: PasswordHash
	sessionStatus?: SessionStatus
}

export class UserEntity extends Entity<UserEntityProps> {
	public static create(props: UserEntityProps): UserEntity {
		return new UserEntity(props)
	}
}
