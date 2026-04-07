import { DomainEvent } from '../events/domain-event'
import { Entity } from './entity'

export abstract class AggregateRoot<T> extends Entity<T> {
    private _domainEvents: DomainEvent[] = []

    public get domainEvents(): DomainEvent[] {
        return this._domainEvents
    }

    public addDomainEvent(event: DomainEvent) {
        this._domainEvents.push(event)
    }

    public clearEvents() {
        this._domainEvents = []
    }

    public dispatchEvents(dispatchFunction: Function) {
        this._domainEvents.forEach(event => dispatchFunction(event))
        this.clearEvents()
    }
}