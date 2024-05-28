import request from "supertest";
import { app } from "../../app";
import { signUpRoute } from "./SignUp.test";

const signoutRoute = "/api/users/signout";

it("successfuly logout", async () => {
  await request(app)
    .post(signUpRoute)
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(201);
  const response = await request(app).get(signoutRoute).expect(200);
  expect(response.get("Set-Cookie")).toBeDefined()
});
