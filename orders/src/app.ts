import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@tiknow/common";
import { newOrderRouter } from "./routes/new";
import { getAllOrdersRouter } from "./routes/getAll";
import { getOrderByIdRouter } from "./routes/getById";
import { cancelOrderRouter } from "./routes/cancel";

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

app.use(newOrderRouter);
app.use(getAllOrdersRouter);
app.use(getOrderByIdRouter);
app.use(cancelOrderRouter);




app.all("*", () => {
  throw new NotFoundError("API doesn't exists");
});

app.use(errorHandler);

export { app };
