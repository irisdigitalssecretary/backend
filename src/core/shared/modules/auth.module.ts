import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@shared/infra/config/env-validation';
import { TokenGenerator } from '../domain/infra/services/token/token-generator';
import { JwtTokenGeneratorService } from '../infra/services/token/jwt-token-generator.service';

@Global()
@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: env.JWT_SECRET,
            signOptions: {
                expiresIn: 60 * 60 // 1 hora 
            },
        }),
    ],
    providers: [
        {
            provide: TokenGenerator,
            useClass: JwtTokenGeneratorService,
        },
        JwtTokenGeneratorService,
    ],
    exports: [TokenGenerator, JwtTokenGeneratorService],
})
export class AuthModule { }