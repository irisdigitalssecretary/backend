import { UniqueEntityId } from '../value-objects/unique-entity-id'

export abstract class Entity<T> {
	constructor(
		protected _props: T,
		public readonly id?: UniqueEntityId,
	) {}

	public equals(object?: Entity<T>): boolean {
		if (!object) return false

		if (this === object) return true

		if (this._props === object._props) return true

		if (this.id && this.id === object.id) return true

		return JSON.stringify(this._props) === JSON.stringify(object._props)
	}
}
