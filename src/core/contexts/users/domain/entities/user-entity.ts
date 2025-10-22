import { Email } from '@shared/domain/value-objects/email'
import { Entity } from '@shared/domain/base/entity'
import { PasswordHash } from '../../../../shared/domain/value-objects/password-hash'
import { UniqueEntityId } from '@shared/domain/value-objects/unique-entity-id'
import { Phone } from '@/core/shared/domain/value-objects/phone'

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
	id?: number
	uuid?: string
	name: string
	email: Email
	password?: PasswordHash
	sessionStatus?: SessionStatus
	status?: UserStatus
	phone?: Phone
	createdAt?: Date
	updatedAt?: Date
}

export class UserEntity extends Entity<UserEntityProps> {
	public get uuid(): string | undefined {
		return this.props.uuid || this.id?.value
	}

	public get sessionStatus(): SessionStatus {
		return this.props.sessionStatus || SessionStatus.OFFLINE
	}

	public get status(): UserStatus {
		return this.props.status || UserStatus.ACTIVE
	}

	public get name() {
		return this.props.name
	}

	public get email(): string {
		return this.props.email.value
	}

	public get password(): string | undefined {
		return this.props.password?.hashedPassword
	}

	public get online(): boolean {
		return this.sessionStatus === SessionStatus.ONLINE
	}

	public get away(): boolean {
		return this.sessionStatus === SessionStatus.AWAY
	}

	public get busy(): boolean {
		return this.sessionStatus === SessionStatus.BUSY
	}

	public get offline(): boolean {
		return this.sessionStatus === SessionStatus.OFFLINE
	}

	public get active(): boolean {
		return this.status === UserStatus.ACTIVE
	}

	public get inactive(): boolean {
		return this.status === UserStatus.INACTIVE
	}

	public get phone(): string {
		return this.props.phone?.value || ''
	}

	public static create(
		props: UserEntityProps,
		id?: UniqueEntityId,
	): UserEntity {
		return new UserEntity(props, id || UniqueEntityId.create())
	}
}
