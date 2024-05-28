import request from "supertest";
import { app } from "../../app";
import { ROUTE } from "../../constants/route";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";

it(`has a route handler that listening ${ROUTE} for a method POST`, async () => {
  const response = await request(app).post(ROUTE).send({});
  expect(response.status).not.toEqual(404);
});

it(`Ticket only created when user is authenticated`, async () => {
  await request(app).post(ROUTE).send({}).expect(401);
});

it(`user not get 401 status if authenticated`, async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post(ROUTE)
    .set("Cookie", cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it(`return bad request status when ticket title is invalid or empty`, async () => {
  const cookie = global.signup();
  await request(app)
    .post(ROUTE)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: "100",
    })
    .expect(400);
});

it(`return bad request status when ticket price is invalid or empty`, async () => {
  const cookie = global.signup();
  await request(app)
    .post(ROUTE)
    .set("Cookie", cookie)
    .send({
      title: "Test",
      price: -10,
    })
    .expect(400);
});

it("Successfully Ticket Creation with status 201", async () => {
  const cookie = global.signup();
  await request(app)
    .post(ROUTE)
    .set("Cookie", cookie)
    .send({
      title: "Test",
      price: "100",
    })
    .expect(201);
});

it("Is new ticket saved in database", async () => {
  const cookie = global.signup();
  let Tickets = await Ticket.find({});
  expect(Tickets.length).toEqual(0);
  await request(app)
    .post(ROUTE)
    .set("Cookie", cookie)
    .send({
      title: "Test",
      price: "100",
    })
    .expect(201);
  Tickets = await Ticket.find({});
  expect(Tickets.length).toEqual(1);
  expect(Tickets[0].price).toEqual("100");
  expect(Tickets[0].title).toEqual("Test");
});

it("is ticket publised the event", async () => {
  const cookie = global.signup();
  await request(app)
    .post(ROUTE)
    .set("Cookie", cookie)
    .send({
      title: "Test",
      price: "100",
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
