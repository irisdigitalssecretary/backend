import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenGenerator, TokenOptions } from '../../../domain/infra/services/token/token-generator';

@Injectable()
export class JwtTokenGeneratorService implements TokenGenerator {
    constructor(private readonly jwtService: JwtService) { }

    async sign(value: Record<string, any>, options?: TokenOptions): Promise<string> {
        return this.jwtService.signAsync(value, options);
    }

    async verify(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token);
    }
}