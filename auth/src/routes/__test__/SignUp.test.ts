import request from "supertest";
import { app } from "../../app";

export const signUpRoute = "/api/users/signUp";

it("returns a status 201 on successful signup", async () => {
  return request(app)
    .post(signUpRoute)
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(201);
});
it("returns a status 400 on invalid email format", async () => {
  return request(app)
    .post(signUpRoute)
    .send({
      email: "test",
      password: "password@123",
    })
    .expect(400);
});
it("returns a status 400 if length of password is not greater than 6", async () => {
  return request(app)
    .post(signUpRoute)
    .send({
      email: "testing@gmail.com",
      password: "pass",
    })
    .expect(400);
});

it("Duplicate email", async () => {
  await request(app)
    .post(signUpRoute)
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(201);
  await request(app)
    .post(signUpRoute)
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(400);
});

it("cookie after successful signup", async () => {
  const response = await request(app)
    .post(signUpRoute)
    .send({ email: "testing@gmail.com", password: "password@123" })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
