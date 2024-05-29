import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";

const createOrder = async (cookie: string[]) => {
  const ticket = Ticket.build({ title: "Testing", price: "100" });
  await ticket.save();
  await request(app).post("/api/orders").set("Cookie", cookie).send({
    ticketID: ticket._id,
  });
};

it("return a ticket if user have cookie-session", async () => {
  const cookie = global.signup();
  await createOrder(cookie); 
  await createOrder(cookie);
  await createOrder(global.signup())
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", cookie)
    .expect(200);
  expect(response.body.length).toEqual(2);
});
