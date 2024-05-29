import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  orderStatues,
  requireAuth,
  validationMiddleware,
} from "@tiknow/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { Order } from "../models/orders";

const router = express.Router();
const EXPIRE_WINDOW_SEC = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketID").not().isEmpty().withMessage("Ticket ID is required")],
  validationMiddleware,
  async (req: Request, res: Response) => {
    const { ticketID } = req.body;
    const ticket = await Ticket.findById(ticketID);
    if (!ticket) {
      throw new NotFoundError("Ticket not Found");
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRE_WINDOW_SEC);
    const newOrder = Order.build({
      userID: req.currentUser!.id,
      status: orderStatues.Created,
      expiresAt: expiration,
      ticket: ticket,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  }
);

export {router as newOrderRouter}