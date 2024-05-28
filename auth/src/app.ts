import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { signInRouter } from "./routes/SignIn";
import { errorHandler, NotFoundError } from "@tiknow/common";
import { signUpRouter } from "./routes/SignUp";
import { currentUserRoute } from "./routes/CurrentUser";
import { signoutRoute } from "./routes/Signout";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(signInRouter);
app.use(signUpRouter);
app.use(signoutRoute);
app.use(currentUserRoute);

app.all("*", () => {
  throw new NotFoundError("API doesn't exists");
});

app.use(errorHandler);

export { app };
