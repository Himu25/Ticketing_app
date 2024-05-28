import request from "supertest";
import { app } from "../../app";
import { signUpRoute } from "./SignUp.test";

const signInRoute = "/api/users/signIn";

it("successful signin", async () => {
  await request(app)
    .post(signUpRoute)
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(201);
  await request(app)
    .post(signInRoute)
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(200);
});

it("wrong password", async () => {
  await request(app)
    .post(signUpRoute)
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(201);
  await request(app)
    .post(signInRoute)
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(400);
});

it("non-existing email", async () => {
  await request(app)
    .post(signInRoute)
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(400);
});

it("cookie after successful signin", async () => {
  await request(app)
    .post(signUpRoute)
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(201);
  const response = await request(app)
    .post(signInRoute)
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});

