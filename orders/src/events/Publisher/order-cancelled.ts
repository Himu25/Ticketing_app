import { OrderCancelledEvent, Publisher, Subjects } from "@tiknow/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
