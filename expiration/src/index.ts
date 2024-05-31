import { OrderCreatedListener } from "./events/Listener";
import { natsWrapper } from "./nats-wrapper";

const run = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    return console.log("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    return console.log("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    return console.log("NATS_URL must be defined");
  }
  if (!process.env.REDIS_HOST) {
    return console.log("REDIS_HOST must be defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    console.log("Nats Connected");
    natsWrapper.client.on("close", () => {
      console.log("Nats connection closed");
      process.exit();
    });
    new OrderCreatedListener(natsWrapper.client).listen();
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (error) {
    console.log(error);
  }
};

run();
