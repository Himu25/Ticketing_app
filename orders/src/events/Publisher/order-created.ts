import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@tiknow/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
