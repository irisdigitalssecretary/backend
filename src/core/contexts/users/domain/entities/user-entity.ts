import { Email } from '@shared/domain/value-objects/email'
import { Entity } from '@shared/domain/base/entity'
import { PasswordHash } from '../../../../shared/domain/value-objects/password-hash'
import { UniqueEntityId } from '@shared/domain/value-objects/unique-entity-id'

export enum SessionStatus {
	ONLINE = 'online',
	AWAY = 'away',
	BUSY = 'busy',
	OFFLINE = 'offline',
}

export enum UserStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
}

export interface UserEntityProps {
	id?: string
	name: string
	email: Email
	password?: PasswordHash
	sessionStatus?: SessionStatus
	status?: UserStatus
}

export class UserEntity extends Entity<UserEntityProps> {
	public static create(
		props: UserEntityProps,
		id?: UniqueEntityId,
	): UserEntity {
		return new UserEntity(props, id)
	}
}
