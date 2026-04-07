import { UserEntity } from "@/core/contexts/user/domain/entities/user.entity";

export class UserSessionViewModel {
    static toHTTP(user: UserEntity) {
        return {
            id: user.props.id,
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            sessionStatus: user.sessionStatus,
            status: user.status,
            createdAt: user.props.createdAt?.toISOString(),
            updatedAt: user.props.updatedAt?.toISOString(),
        }
    }
}
