import { Email } from '@shared/domain/value-objects/email'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '../domain/entities/user-entity'
import { PasswordHash } from '@shared/domain/value-objects/password-hash'
import { Hasher } from '@shared/domain/infra/services/hasher'
import { randomUUID } from 'node:crypto'

interface MakeUserEntityProps {
	id?: string
	uuid?: string
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
		uuid: props.uuid ?? randomUUID(),
		email: Email.create(props.email),
		status: props.status ?? UserStatus.ACTIVE,
		sessionStatus: props.sessionStatus ?? SessionStatus.ONLINE,
		password: props.password
			? await PasswordHash.create(props.password, hasher)
			: undefined,
	})
}
