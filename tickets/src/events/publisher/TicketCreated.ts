import { Publisher, Subjects, TicketCreatedEvent } from "@tiknow/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}