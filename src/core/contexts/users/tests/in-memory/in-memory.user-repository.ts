import { randomUUID } from 'node:crypto'
import {
	SessionStatus,
	UserEntity,
	UserStatus,
} from '../../domain/entities/user-entity'
import { UserRepository } from '../../domain/repositories/user-repository'

export class InMemoryUserRepository implements UserRepository {
	public readonly users: UserEntity[] = []

	public create(user: UserEntity): Promise<UserEntity> {
		return new Promise((resolve) => {
			user.props.id = randomUUID()
			this.users.push(user)
			resolve(user)
		})
	}

	public findByEmail(email: string): Promise<UserEntity | null> {
		return new Promise((resolve) => {
			const user = this.users.find(
				(user) => user.props.email.value === email,
			)
			resolve(user ?? null)
		})
	}

	public findById(id: string): Promise<UserEntity | null> {
		return new Promise((resolve) => {
			const user = this.users.find((user) => user.props.id === id)
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

	public delete(id: string): Promise<void> {
		return new Promise((resolve) => {
			const index = this.users.findIndex((user) => user.props.id === id)
			this.users.splice(index, 1)
			resolve()
		})
	}

	public updateSessionStatus(
		id: string,
		sessionStatus: SessionStatus,
	): Promise<UserEntity> {
		return new Promise((resolve) => {
			const index = this.users.findIndex((user) => user.props.id === id)
			this.users[index].props.sessionStatus = sessionStatus
			resolve(this.users[index])
		})
	}

	public inactive(id: string): Promise<void> {
		return new Promise((resolve) => {
			const index = this.users.findIndex((user) => user.props.id === id)
			this.users[index].props.status = UserStatus.INACTIVE
			resolve()
		})
	}

	public active(id: string): Promise<void> {
		return new Promise((resolve) => {
			const index = this.users.findIndex((user) => user.props.id === id)
			this.users[index].props.status = UserStatus.ACTIVE
			resolve()
		})
	}
}
