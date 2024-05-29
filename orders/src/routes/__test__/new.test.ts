import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/tickets";
import { Order } from "../../models/orders";
import { orderStatues } from "@tiknow/common";

it("returns unauthorized error if user don't have cookie-session", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("returns a validation error if ticket id is not provided in body", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({})
    .expect(400);
});
it("returns a not found error if ticket is not exist", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketID: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a bad request error if ticket is already reserved", async () => {
  const ticket = Ticket.build({ title: "Testing", price: "100" });
  await ticket.save();
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 15 * 60);
  const order = Order.build({
    status: orderStatues.Created,
    expiresAt: expiration,
    ticket,
    userID: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketID: ticket._id,
    })
    .expect(400);
});

it("returns a ticket created when ticket is not reserved", async () => {
  const ticket = Ticket.build({ title: "Testing", price: "100" });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketID: ticket._id,
    })
    .expect(201)
});

it.todo('is order created event published')
