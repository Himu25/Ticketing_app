import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@tiknow/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/TicketUpdated";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "ticket-queue";
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found")
    }
    ticket.set({
       orderID: data.id
    })
    await ticket.save()
    new TicketUpdatedPublisher(this.client).onPublish({
      id: ticket.id,
      price: ticket.price,
      version: ticket.version,
      title: ticket.title,
      userId: ticket.userID,
      orderId: ticket.orderID    
    })
    msg.ack();
  }
}
