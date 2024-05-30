import express, { Request, Response } from "express";
import { ROUTE } from "../constants/route";
import { Ticket } from "../models/tickets";
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from "@tiknow/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publisher/TicketUpdated";

const router = express.Router();

router.put(
  `${ROUTE}/:id`,
  requireAuth,
  [
    body("title").not().notEmpty().withMessage("Title is not provided"),
    body("price").isFloat({ gt: 0 }).withMessage("Invalid Price"),
  ],
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }
    if (ticket.orderID) {
      throw new BadRequestError("Cannot edit a reserved Ticket")
    }
    if (ticket.userID !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    const stan = natsWrapper.client;
    await new TicketUpdatedPublisher(stan).onPublish({
      title: ticket.title,
      id: ticket.id,
      price: ticket.price,
      userId: ticket.userID,
      version: ticket.version
    });
    res.json(ticket);
  }
);

export { router as updateTicketsRouter };
