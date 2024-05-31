import { Listener, Subjects, TicketUpdatedEvent } from "@tiknow/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = "order-queue";
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, price, title, version } = data;

    const ticket = await Ticket.findOne({ _id: id, version: version - 1 });

    if (!ticket) {
      msg.ack();
      throw new Error("Ticket not found");
    }
    ticket.set({
      price,
      title,
    });
    await ticket.save();
    msg.ack();
  }
}
