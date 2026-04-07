import { SessionStatus } from "@/core/shared/domain/constants/user/user-session-status.enum";
import { DomainEvent } from "@/core/shared/domain/events/domain-event";

interface UserLoggedInProps {
    userUuid: string
    companyId: number
    sessionStatus: SessionStatus
}

export class UserLoggedIn implements DomainEvent {
    public readonly name: 'UserLoggedIn' = 'UserLoggedIn'
    public readonly ocurredAt: Date
    public props: UserLoggedInProps

    constructor(props: UserLoggedInProps) {
        this.props = props
        this.ocurredAt = new Date()
    }
}