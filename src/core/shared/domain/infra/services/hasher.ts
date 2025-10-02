export type HasherType = 'password'

export abstract class Hasher {
	public readonly HASH_NUMBER: number = 10
	public abstract hash(value: string): Promise<string>
	public abstract compare(value: string, hash: string): Promise<boolean>
}
