import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  orderStatues,
} from "@tiknow/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = "payment-queue";
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    console.log(data);   
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not Found");
    }
    order.set({
      status: orderStatues.Cancelled,
    });
    await order.save();
    msg.ack();
  }
}
