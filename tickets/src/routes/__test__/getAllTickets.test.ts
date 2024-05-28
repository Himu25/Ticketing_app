import request from "supertest";
import { app } from "../../app";
import { ROUTE } from "../../constants/route";

const createTicket = async () => {
  await request(app).post(ROUTE).set("Cookie", global.signup()).send({
    title: "Test",
    price: "100",
  });
};

it("not return api not exists error", async () => {
  const response = await request(app).get(ROUTE);
  expect(response.status).not.toEqual(404);
});

it("can fetch all tickets that are created", async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  const response = await request(app).get(ROUTE).expect(200);
  expect(response.body.Tickets.length).toEqual(3);
});
