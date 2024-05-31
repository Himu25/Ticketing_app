import Queue from "bull";
import { ExpirationCompletedPublisher } from "../events/Publisher";
import { natsWrapper } from "../nats-wrapper";

interface payload {
  orderId: string;
}

const expirationQueue = new Queue<payload>("expiration:queue", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletedPublisher(natsWrapper.client).onPublish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
