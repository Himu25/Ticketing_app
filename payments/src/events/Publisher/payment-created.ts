import { Publisher, PaymentCreatedEvent, Subjects } from "@tiknow/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
