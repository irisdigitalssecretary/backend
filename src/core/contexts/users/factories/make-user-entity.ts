import { Email } from '@shared/domain/value-objects/email'
import { UserEntity } from '../domain/entities/user-entity'
import { PasswordHash } from '@shared/domain/value-objects/password-hash'
import { Hasher } from '@shared/domain/infra/services/hasher'

interface MakeUserEntityProps {
	name: string
	email: string
	password: string
}

export async function makeUserEntity(
	props: MakeUserEntityProps,
	hasher: Hasher,
) {
	return UserEntity.create({
		...props,
		email: Email.create(props.email),
		password: await PasswordHash.create(props.password, hasher),
	})
}
