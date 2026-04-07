import { EventHandler } from "@/core/shared/domain/events/event-handler";
import { UserLoggedIn } from "../../domain/events/user-logged-in.event";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { DomainEvents } from "@/core/shared/domain/events/domain-events";
import { UserRepository } from "../../domain/repositories/user.repository";
import { SessionStatus } from "@/core/shared/domain/constants/user/user-session-status.enum";

@Injectable()
export class UpdateUserSessionStatusHandler implements EventHandler, OnModuleInit {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    onModuleInit() {
        DomainEvents.register(
            'UserLoggedIn',
            this
        )
    }

    async handle(event: UserLoggedIn): Promise<void> {
        const props = event.props
        const user = await this.userRepository.findByUuid(props.userUuid, props.companyId)

        if (!user) return

        user.update({ sessionStatus: props.sessionStatus })
    }
}