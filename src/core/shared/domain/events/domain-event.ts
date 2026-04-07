export abstract class DomainEvent {
    abstract readonly name: string
    abstract readonly ocurredAt: Date
    abstract props: Record<string, any>
}