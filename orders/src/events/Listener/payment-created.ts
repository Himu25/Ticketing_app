import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  orderStatues,
} from "@tiknow/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = "order-queue";
  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { id, orderId, stripeId } = data;
    const order = await Order.findById(orderId);
    if (!order) {
      msg.ack();
      throw new Error("Order not found");
    }
    order.set({
      status: orderStatues.Completed,
    });
    await order.save();
    msg.ack();
  }
}
