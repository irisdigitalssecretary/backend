import { OffsetPagination } from '@/core/shared/domain/value-objects/offset-pagination'
import { UserEntity } from '../../domain/entities/user.entity'
import {
	UserFields,
	UserRepository,
	UserSelectableFields,
} from '../../domain/repositories/user-repository'
import { FindManyOptions } from '@/core/shared/domain/utils/types/find-many'
import { UserStatus } from '@/core/shared/domain/constants/user/user-status.enum'
import { SessionStatus } from '@/core/shared/domain/constants/user/user-session-status.enum'

export class InMemoryUserRepository implements UserRepository {
	public readonly users: UserEntity[] = []

	public create(user: UserEntity): Promise<UserEntity> {
		return new Promise((resolve) => {
			user.props.id = user.props.id || Math.floor(Math.random() * 100)
			this.users.push(user)
			resolve(user)
		})
	}

	public findByEmail(email: string): Promise<UserEntity | null> {
		return new Promise((resolve) => {
			const user = this.users.find((user) => user.email === email)
			resolve(user ?? null)
		})
	}

	public findById(id: number): Promise<UserEntity | null> {
		return new Promise((resolve) => {
			const user = this.users.find((user) => user.props.id === id)
			resolve(user ?? null)
		})
	}

	public findByUuid(uuid: string): Promise<UserEntity | null> {
		return new Promise((resolve) => {
			const user = this.users.find((user) => user.uuid === uuid)
			resolve(user ?? null)
		})
	}

	public update(userToUpdate: UserEntity): Promise<UserEntity> {
		return new Promise((resolve) => {
			const index = this.users.findIndex(
				(user) => userToUpdate.props.id === user.props.id,
			)

			this.users[index] = userToUpdate

			resolve(this.users[index])
		})
	}

	public delete(id: number): Promise<void> {
		return new Promise((resolve) => {
			const index = this.users.findIndex((user) => user.props.id === id)
			this.users.splice(index, 1)
			resolve()
		})
	}

	public updateSessionStatus(
		id: number,
		sessionStatus: SessionStatus,
	): Promise<UserEntity> {
		return new Promise((resolve) => {
			const index = this.users.findIndex((user) => user.props.id === id)
			this.users[index].props.sessionStatus = sessionStatus
			resolve(this.users[index])
		})
	}

	public updateStatus(id: number, status: UserStatus): Promise<UserEntity> {
		return new Promise((resolve) => {
			const index = this.users.findIndex((user) => user.props.id === id)
			this.users[index].props.status = status
			resolve(this.users[index])
		})
	}

	public findManyByOffsetPagination(
		props: FindManyOptions<
			Partial<UserFields>,
			OffsetPagination,
			UserSelectableFields
		>,
	): Promise<UserEntity[]> {
		return new Promise((resolve) => {
			const { filters, select, orderBy } = props

			let users = this.users.filter((user) => {
				let condition = true

				if (filters?.name) {
					condition = !!(
						condition &&
						user.name
							.toLowerCase()
							.includes(filters.name.toLowerCase())
					)
				}
				if (filters?.email) {
					condition = !!(
						condition &&
						user.email
							.toLowerCase()
							.includes(filters.email.toLowerCase())
					)
				}
				if (filters?.phone) {
					condition = !!(
						condition &&
						user.phone
							?.toLowerCase()
							.includes(filters.phone.toLowerCase())
					)
				}
				if (filters?.status) {
					condition = !!(condition && user.status === filters.status)
				}
				if (filters?.sessionStatus) {
					condition = !!(
						condition &&
						user.sessionStatus === filters.sessionStatus
					)
				}

				return condition
			})

			const orderByEntries = Object.entries(orderBy || {})
			users = users.sort((a, b) => {
				for (const [field, direction] of orderByEntries) {
					let compareResult = 0

					const fieldA = a[field]
					const fieldB = b[field]

					if (fieldA && fieldB) {
						if (
							typeof fieldA === 'string' &&
							typeof fieldB === 'string'
						) {
							compareResult = String(fieldA)
								.toLowerCase()
								.localeCompare(
									String(fieldB).toLowerCase(),
									'pt-BR',
								)
						}
					}

					if (compareResult !== 0) {
						return direction === 'desc'
							? -compareResult
							: compareResult
					}
				}

				return 0
			})

			users = users.slice(
				props.pagination?.after,
				(props.pagination?.after || 0) +
					(props.pagination?.limit || 15),
			)

			if (select && select.length > 0) {
				users = users.map((user) => {
					const selectedFields: any = {}
					select.forEach((field) => {
						if (field in user || field in user.props) {
							selectedFields[field] =
								user[field] || user.props[field]
						}
					})

					return UserEntity.create(
						{
							...selectedFields,
							email: user.props.email,
						},
						user.id,
					)
				})
			}

			resolve(users)
		})
	}
}
