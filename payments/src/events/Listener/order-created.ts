import { Listener, OrderCreatedEvent, Subjects } from "@tiknow/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "payment-queue";
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log(data);
    
    const order = Order.build({
      id: data.id,
      status: data.status,
      userId: data.userId,
      price: data.ticket.price,
      version: data.version,
    });
    console.log(order,"gvdgrbtfhbtfg");
    
    await order.save();
    console.log(order);
    
    msg.ack();
  }
}
