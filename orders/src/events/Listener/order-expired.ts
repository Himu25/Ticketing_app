import {
  ExpirationCompletedEvent,
  Listener,
  Subjects,
  orderStatues,
} from "@tiknow/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { OrderCancelledPublisher } from "../Publisher/order-cancelled";

export class OrderExpiredListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName = "order-queue";
  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const id = data.orderId;
    const order = await Order.findById(id).populate("ticket");
    if (!order) {
      msg.ack();
      throw new Error("Order Not Found");
    }
    if (order.status === orderStatues.Completed) {
      return msg.ack();
    }
    order.set({
      status: orderStatues.Cancelled,
    });
   await order.save();
    new OrderCancelledPublisher(this.client).onPublish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });
    msg.ack()
  }
}
