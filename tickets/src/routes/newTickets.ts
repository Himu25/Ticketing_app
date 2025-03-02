import express, { Request, Response } from "express";
import { ROUTE } from "../constants/route";
import { requireAuth, validationMiddleware } from "@tiknow/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { natsWrapper } from "../nats-wrapper";
import { TicketCreatedPublisher } from "../events/publisher/TicketCreated";

const router = express.Router();

router.post(
  ROUTE,
  requireAuth,
  [
    body("title").not().notEmpty().withMessage("Title is not provided"),
    body("price").isFloat({ gt: 0 }).withMessage("Invalid Price"),
  ],
  validationMiddleware,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const newTicket = Ticket.build({
      title,
      price,
      userID: req.currentUser!.id,
    });
    console.log("🚀 ~ title, price:", title, price);
    await newTicket.save();
    const stan = natsWrapper.client;
    await new TicketCreatedPublisher(stan).onPublish({
      title: newTicket.title,
      id: newTicket.id,
      price: newTicket.price,
      version: newTicket.version,
      userId: newTicket.userID,
    });
    res.status(201).json(newTicket);
  }
);

export { router as newTicketsRouter };
