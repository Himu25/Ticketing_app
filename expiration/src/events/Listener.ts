import { Listener, OrderCreatedEvent, Subjects } from "@tiknow/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../queue/expiration";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "expiration-queue";
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // here we have added a item to queue FIFO
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    );
    msg.ack();
  }
}
