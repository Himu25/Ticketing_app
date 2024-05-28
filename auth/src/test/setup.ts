import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  var signup: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "secret";
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let i = 0; i < collections.length; i++) {
    await collections[i].deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = async () => {
  const response = await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@gmail.com",
      password: "password@123",
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  if (!cookie) {
    console.error("Cookie is undefined");
    return [];
  }

  return cookie;
};
