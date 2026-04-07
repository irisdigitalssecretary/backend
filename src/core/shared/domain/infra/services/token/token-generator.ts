export interface TokenOptions {
    expiresIn?: any;
}

export abstract class TokenGenerator {
    public abstract sign(value: Record<string, any>, options?: TokenOptions): Promise<string>
    public abstract verify(token: string): Promise<string>
}
