import { UniqueEntityId } from '../value-objects/unique-entity-id'

export abstract class Entity<T> {
	constructor(
		public props: T,
		public readonly id?: UniqueEntityId,
	) {}

	public equals(object?: Entity<T>): boolean {
		if (!object) return false

		if (this === object) return true

		if (this.props === object.props) return true

		if (this.id && this.id === object.id) return true

		return JSON.stringify(this.props) === JSON.stringify(object.props)
	}
}
