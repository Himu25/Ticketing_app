import { Listener, OrderCancelledEvent, Subjects } from "@tiknow/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/TicketUpdated";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = "ticket-queue";
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not Found");
    }
    ticket.set({
      orderID: undefined,
    });
    await ticket.save();
    new TicketUpdatedPublisher(this.client).onPublish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userID,
      version: ticket.version,
    });
    msg.ack();
  }
}
