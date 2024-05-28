import request from "supertest";
import { app } from "../../app";
import { ROUTE } from "../../constants/route";
import mongoose from "mongoose";


it("returns a not found error if invalid id is given", async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app).get(`${ROUTE}/${id}`).expect(404);
});

it("returns a right ticket with status 200", async () => {
  const newTicket = await request(app)
    .post(ROUTE)
    .set("Cookie", global.signup())
    .send({ title: "Test", price: "100" });
  const ticket = await request(app).get(`${ROUTE}/${newTicket.body.id}`);  
  expect(ticket.body.title).toEqual("Test");
  expect(ticket.body.price).toEqual("100");
});
