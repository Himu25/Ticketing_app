import { NotAuthorizedError, NotFoundError, requireAuth } from "@tiknow/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orders";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");
    if (!order) {
      throw new NotFoundError("Order not found!");
    }
    if (order.userID !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.json(order);
  }
);

export { router as getOrderByIdRouter };
