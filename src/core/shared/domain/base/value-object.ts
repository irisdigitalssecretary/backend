interface ValueObjectProps {
	[key: string]: any
}

export abstract class ValueObject<T extends ValueObjectProps> {
	public readonly props: T

	constructor(props: T) {
		this.props = Object.freeze(props)
	}

	public equals(vo?: ValueObject<T>): boolean {
		if (!vo) return false

		if (this === vo) return true

		return JSON.stringify(this.props) === JSON.stringify(vo.props)
	}
}
