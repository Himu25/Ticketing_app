import request from "supertest";
import { app } from "../../app";
import { ROUTE } from "../../constants/route";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/tickets";

const createID = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

it("is this api exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`${ROUTE}/${id}`);
  expect(response.status).not.toEqual(404);
});

it("give not authorized error if user don't have cookie-session", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`${ROUTE}/${id}`)
    .send({ title: "test", price: "200" })
    .expect(401);
});

it("gives error if id is not associated to any tickets", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`${ROUTE}/${id}`)
    .set("Cookie", global.signup())
    .send({ title: "test", price: "200" })
    .expect(404);
});

it("give forbidden error if user not own ticket", async () => {
  const response = await request(app)
    .post(ROUTE)
    .set("Cookie", global.signup({ email: "test1@gmail.com", id: createID() }))
    .send({
      title: "Test1",
      price: "100",
    });
  const id = response.body.id;
  await request(app)
    .put(`${ROUTE}/${id}`)
    .set("Cookie", global.signup({ email: "test2@gmail.com", id: createID() }))
    .send({
      title: "Test2",
      price: "200",
    })
    .expect(401);
});

it("reject the edit if it reserved", async () => {
  const cookie = global.signup();
  const response = await request(app).post(ROUTE).set("Cookie", cookie).send({
    title: "Test1",
    price: "100",
  });
  const id = response.body.id;
  const ticket = await Ticket.findById(id);
  await ticket?.set({
    orderID: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket?.save();
  await request(app)
    .put(`${ROUTE}/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "Test2",
      price: "200",
    })
    .expect(400);
});

it("returns status 200 if everythings is ok", async () => {
  const userid = createID();
  const response = await request(app)
    .post(ROUTE)
    .set("Cookie", global.signup({ email: "test@gmail.com", id: userid }))
    .send({
      title: "Test",
      price: "100",
    });
  const ticketid = response.body.id;
  const updatedResponse = await request(app)
    .put(`${ROUTE}/${ticketid}`)
    .set("Cookie", global.signup({ email: "test@gmail.com", id: userid }))
    .send({
      title: "Test2",
      price: "200",
    });
  expect(updatedResponse.body.title).toEqual("Test2");
  expect(updatedResponse.body.price).toEqual("200");
});

it("is it publish the event to nats after updating", async () => {
  const userid = createID();
  const response = await request(app)
    .post(ROUTE)
    .set("Cookie", global.signup({ email: "test@gmail.com", id: userid }))
    .send({
      title: "Test",
      price: "100",
    });
  const ticketid = response.body.id;
  await request(app)
    .put(`${ROUTE}/${ticketid}`)
    .set("Cookie", global.signup({ email: "test@gmail.com", id: userid }))
    .send({
      title: "Test2",
      price: "200",
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
