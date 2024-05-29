import { NotAuthorizedError, NotFoundError, orderStatues, requireAuth } from "@tiknow/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orders";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');
    if (!order) {
      throw new NotFoundError("Ticket not found");
    }
    if (order.userID !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }
    order.set({
      status: orderStatues.Cancelled,
    });
    await order.save();
    res.json(order);
  }
);

export { router as cancelOrderRouter };
