import { Email } from '@shared/domain/value-objects/email'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '../domain/entities/user-entity'
import { PasswordHash } from '@shared/domain/value-objects/password-hash'
import { Hasher } from '@shared/domain/infra/services/hasher'

interface MakeUserEntityProps {
	id?: string
	name: string
	email: string
	password?: string
	sessionStatus?: SessionStatus
	status?: UserStatus
}

export async function makeUserEntity(
	props: MakeUserEntityProps,
	hasher: Hasher,
) {
	return UserEntity.create({
		...props,
		email: Email.create(props.email),
		password: props.password
			? await PasswordHash.create(props.password, hasher)
			: undefined,
	})
}
