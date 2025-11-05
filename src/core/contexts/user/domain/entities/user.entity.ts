import { Email } from '@shared/domain/value-objects/email'
import { Entity } from '@shared/domain/base/entity'
import { Password } from '../../../../shared/domain/value-objects/password'
import { UniqueEntityId } from '@shared/domain/value-objects/unique-entity-id'
import { Phone } from '@/core/shared/domain/value-objects/phone'
import { Hasher } from '@/core/shared/domain/infra/services/hasher'
import { OldPasswordRequiredError } from '../errors/old-password-required'
import { OldPasswordInvalidError } from '../errors/old-password-invalid'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'

interface UpdatePasswordEntityProps {
	hasher: Hasher
	newPassword: string
	oldPassword?: string
}

export interface UserEntityProps {
	id?: number
	uuid?: string
	name: string
	email: Email
	password?: Password
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

	public get createdAt(): Date {
		return this.props.createdAt || new Date()
	}

	public get updatedAt(): Date {
		return this.props.updatedAt || new Date()
	}

	public get props() {
		return this._props || {}
	}

	public set props(props: UserEntityProps) {
		this._props = props
	}

	public async updatePassword({
		hasher,
		newPassword,
		oldPassword,
	}: UpdatePasswordEntityProps) {
		if (!oldPassword) {
			throw new OldPasswordRequiredError()
		}

		const isOldPasswordValid = await hasher.compare(
			oldPassword,
			this.password!,
		)

		if (!isOldPasswordValid) {
			throw new OldPasswordInvalidError()
		}

		this.props.password = await Password.create(newPassword, hasher)
	}

	public static create(
		props: UserEntityProps,
		id?: UniqueEntityId,
	): UserEntity {
		return new UserEntity(props, id ?? UniqueEntityId.create())
	}
}
