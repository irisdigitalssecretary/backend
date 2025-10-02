import { randomUUID } from 'crypto'
import { ValueObject } from '../base/value-object'

export class UniqueEntityId extends ValueObject<{ value: string }> {
	constructor(id?: string) {
		super({ value: id ?? randomUUID() })
	}

	get value(): string {
		return this.props.value
	}

	public static create(id?: string): UniqueEntityId {
		return new UniqueEntityId(id)
	}
}
