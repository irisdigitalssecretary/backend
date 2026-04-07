import { Body, Controller, HttpException, Post, Res } from "@nestjs/common";
import { UserSessionUseCase } from "../../../application/use-cases/user-session.use-case";
import { ZodValidationPipe } from "@/core/shared/infra/http/pipes/zod-validation-pipes";
import { userSessionSchema, type UserSessionBody } from "../dtos/user-session.dto";
import { UserSessionViewModel } from "../view-models/user-session-view-model";
import e, { type Response } from "express";
import { env } from "@/core/shared/infra/config/env-validation";

@Controller('login')
export class UserController {

    constructor(
        private readonly userSessionUseCase: UserSessionUseCase
    ) { }

    @Post()
    async login(
        @Body(new ZodValidationPipe(userSessionSchema)) body: UserSessionBody,
        @Res({ passthrough: true }) response: Response
    ) {
        const { email, password, companyId } = body

        const result = await this.userSessionUseCase.execute({
            email,
            password,
            companyId: Number(companyId)
        })

        if (result.isLeft()) {
            throw new HttpException(result.value.message, result.value.statusCode)
        }

        const { token, user, refreshToken } = result.value

        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: env.APP_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias em milissegundos
        })

        return {
            token,
            user: UserSessionViewModel.toHTTP(user)
        }
    }
}
