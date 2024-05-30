import {
  NotAuthorizedError,
  NotFoundError,
  orderStatues,
  requireAuth,
} from "@tiknow/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orders";
import { OrderCancelledPublisher } from "../events/Publisher/order-cancelled";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");
    if (!order) {
      throw new NotFoundError("Ticket not found");
    }
    if (order.userID !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.set({
      status: orderStatues.Cancelled,
    });
    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).onPublish({
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
      id: order.id,
    });
    res.json(order);
  }
);

export { router as cancelOrderRouter };
