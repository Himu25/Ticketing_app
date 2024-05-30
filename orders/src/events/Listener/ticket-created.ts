import { Listener, Subjects, TicketCreatedEvent } from "@tiknow/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "order-queue";
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;
    const newTicket = Ticket.build({
      price,
      title,
      id,
    });
    await newTicket.save();
    msg.ack();
  }
}
