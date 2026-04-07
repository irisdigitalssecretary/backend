import { DomainEvent } from "./domain-event";

export abstract class EventHandler {
    abstract handle(event: DomainEvent): Promise<any>
}