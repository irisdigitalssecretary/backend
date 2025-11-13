import { Email } from '@shared/domain/value-objects/email'
import { UserEntity } from '../domain/entities/user.entity'
import { Password } from '@/core/shared/domain/value-objects/password'
import { Hasher } from '@/core/shared/domain/infra/services/crypt/hasher'
import { Phone } from '@/core/shared/domain/value-objects/phone'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'

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

export class UserFactory {
	static async create(props: MakeUserEntityProps, hasher?: Hasher) {
		const password = props.password
			? await Password.create(props.password, hasher)
			: undefined

		const phone = props.phone ? Phone.create(props.phone) : undefined

		return UserEntity.create({
			...props,
			uuid: props.uuid,
			email: Email.create(props.email),
			phone,
			password,
			createdAt: props.createdAt || new Date(),
			updatedAt: props.updatedAt || new Date(),
		})
	}

	static reconstitute(props: MakeUserEntityProps) {
		const phone = props.phone ? Phone.fromString(props.phone) : undefined
		const password = props.password
			? Password.fromHash(props.password)
			: undefined

		return UserEntity.restore({
			...props,
			uuid: props.uuid,
			email: Email.create(props.email),
			phone,
			password,
			createdAt: props.createdAt || new Date(),
			updatedAt: props.updatedAt || new Date(),
		})
	}
}
