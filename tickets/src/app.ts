import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { getTicketsByID } from "./routes/getTicketsByID";
import { getAllTicketsRouter } from "./routes/getAllTickets";
import { NotFoundError, currentUser, errorHandler } from "@tiknow/common";
import { newTicketsRouter } from "./routes/newTickets";
import { updateTicketsRouter } from "./routes/updateTickets";
import { getUserTickets } from "./routes/getUserTickets";

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

app.use(getTicketsByID);
app.use(getAllTicketsRouter);
app.use(newTicketsRouter);
app.use(updateTicketsRouter);
app.use(getUserTickets);

app.all("*", () => {
  throw new NotFoundError("API doesn't exists");
});

app.use(errorHandler);

export { app };
