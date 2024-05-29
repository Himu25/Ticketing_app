import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";

export const createOrder = async (cookie: string[]) => {
  const ticket = Ticket.build({ title: "Testing", price: "100" });
  await ticket.save();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketID: ticket._id,
    });
  return response.body.id;
};

it("return a ticket successfuly if valid id is given", async () => {
  const cookie = global.signup();
  const id = await createOrder(cookie);
  const res = await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", cookie)
    .expect(200);
  expect(res.body.id).toEqual(id);
});

it("return a not found error if order id is invalid", async () => {
  const cookie = global.signup();
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/orders/${id}`).set("Cookie", cookie).expect(404);
});

it("return unauthorized error if user try to fetch any other user's ticket", async () => {
  const id = await createOrder(global.signup());
  const res = await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", global.signup())
    .expect(401);
});
