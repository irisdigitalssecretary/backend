import { Email } from '@shared/domain/value-objects/email'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '../domain/entities/user-entity'
import { PasswordHash } from '@shared/domain/value-objects/password-hash'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { Phone } from '@/core/shared/domain/value-objects/phone'

interface MakeUserEntityProps {
	id?: number
	uuid?: string
	name: string
	email: string
	password?: string
	phone?: string
	sessionStatus?: SessionStatus
	status?: UserStatus
	createdAt?: Date
	updatedAt?: Date
}

export async function makeUserEntity(
	props: MakeUserEntityProps,
	hasher?: Hasher,
) {
	return UserEntity.create({
		...props,
		uuid: props.uuid,
		email: Email.create(props.email),
		phone: props.phone ? Phone.create(props.phone) : undefined,
		password:
			props.password && hasher
				? await PasswordHash.create(props.password, hasher)
				: undefined,
		createdAt: props.createdAt || new Date(),
		updatedAt: props.updatedAt || new Date(),
	})
}
