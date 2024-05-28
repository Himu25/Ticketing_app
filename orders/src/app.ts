import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@tiknow/common";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);


app.all("*", () => {
  throw new NotFoundError("API doesn't exists");
});

app.use(errorHandler);

export { app };
