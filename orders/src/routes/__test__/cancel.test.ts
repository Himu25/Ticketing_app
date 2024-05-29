import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { createOrder } from "./getById.test";
import { orderStatues } from "@tiknow/common";

it("returns a not found error if order is not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete(`/api/orders/${id}`)
    .set("Cookie", global.signup())
    .send({})
    .expect(404);
});

it('cancel the ticket successfuly',async()=>{
    const cookie = global.signup()
    const id = await createOrder(cookie)
    const response = await request(app)
      .delete(`/api/orders/${id}`)
      .set("Cookie", cookie)
      .send({})
    expect(response.body.status).toEqual(orderStatues.Cancelled)
})

it("returns not authorized error if user try to cancel any other user's order", async () => {
  const id = await createOrder(global.signup());
  const response = await request(app)
    .delete(`/api/orders/${id}`)
    .set("Cookie", global.signup())
    .send({})
    .expect(401)
});
