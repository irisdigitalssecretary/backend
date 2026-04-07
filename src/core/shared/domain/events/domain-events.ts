import { DomainEvent } from "./domain-event";
import { EventHandler } from "./event-handler";

export class DomainEvents {
    private static handlers: Record<string, EventHandler> = {}

    public static register(eventName: string, handler: EventHandler) {
        DomainEvents.handlers[eventName] = handler
    }

    public static dispatch(event: DomainEvent) {
        const name = event.name
        const handler = DomainEvents.handlers[name]

        if (handler) {
            handler.handle(event)
        }
    }

    public static clearHandlers() {
        DomainEvents.handlers = {}
    }
}