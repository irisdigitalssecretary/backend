import { Injectable } from "@nestjs/common"
import { UserRepository } from "../../../user/domain/repositories/user.repository"
import { Either, left, right } from "@/core/shared/domain/base/either"
import { InvalidSessionError } from "../errors/invalid-session"
import { Hasher } from "@/core/shared/domain/infra/services/crypt/hasher"
import { UserEntity } from "../../../user/domain/entities/user.entity"
import { TokenGenerator } from "@/core/shared/domain/infra/services/token/token-generator"
import { DomainEvents } from "@/core/shared/domain/events/domain-events"
import { SEVEN_DAYS_IN_SECONDS } from "@/core/shared/application/constants/days-in-seconds"

interface SessionRequest {
    email: string
    password: string
    companyId: number
}

type SessionResponse = Either<
    InvalidSessionError,
    {
        token: string
        refreshToken: string
        user: UserEntity
    }
>

@Injectable()
export class UserSessionUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hasher: Hasher,
        private readonly tokenGenerator: TokenGenerator
    ) { }

    public async execute(
        props: SessionRequest,
    ): Promise<SessionResponse> {
        const { email, password, companyId } = props

        if (!email || !password) return left(new InvalidSessionError())

        const user = await this.userRepository.findByEmail(email, companyId)

        if (!user) return left(new InvalidSessionError())

        const { password: userFoundPassword } = user

        if (!userFoundPassword) return left(new InvalidSessionError())

        const isValidPassword = await this.hasher.compare(password, userFoundPassword)

        if (!isValidPassword) return left(new InvalidSessionError())

        user.recordLogin()
        user.dispatchEvents(DomainEvents.dispatch)

        const tokenPayload = {
            id: user.props.id,
            companyId,
            isMaster: user.isMaster ?? false
        }

        const token = await this.tokenGenerator.sign(tokenPayload)

        const refreshToken = await this.tokenGenerator.sign(
            tokenPayload,
            {
                expiresIn: SEVEN_DAYS_IN_SECONDS
            }
        )

        return right({
            token,
            refreshToken,
            user
        })
    }
}
