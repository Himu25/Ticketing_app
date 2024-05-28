import request from "supertest";
import { app } from "../../app";

const currentUserRoute = "/api/users/currentUser";

it("current user", async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .get(currentUserRoute)
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@gmail.com");
});

it("current user without cookie", async () => {
  const response = await request(app)
    .get(currentUserRoute)
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
