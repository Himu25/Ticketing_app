import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/Listener/ticket-created";
import { TicketUpdatedListener } from "./events/Listener/ticket-updated";
import { OrderExpiredListener } from "./events/Listener/order-expired";

const run = async () => {
  if (!process.env.JWT_KEY) {
    return console.log("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URL) {
    return console.log("MONGO_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    return console.log("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    return console.log("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    return console.log("NATS_URL must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
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
    })
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen();
    new OrderExpiredListener(natsWrapper.client).listen();

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (error) {
    console.log(error);
  }
  app.listen(4002, () => {
    console.log("Running on port 4002");
  });
};

run();
