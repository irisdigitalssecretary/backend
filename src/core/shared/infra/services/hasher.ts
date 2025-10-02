import { Hasher as IHasher } from '@/core/shared/domain/infra/services/hasher'
import bcrypt from 'bcrypt'

export class Hasher implements IHasher {
	public readonly HASH_NUMBER = 10

	public hash(value: string): Promise<string> {
		return bcrypt.hash(value, this.HASH_NUMBER)
	}

	public compare(value: string, hash: string): Promise<boolean> {
		return bcrypt.compare(value, hash)
	}
}
