import { requireAuth } from "@tiknow/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orders";

const router = express.Router();

router.get(
  "/api/orders",
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({userID: req.currentUser!.id}).populate('ticket')
    res.json(orders)
  }
);

export { router as getAllOrdersRouter };
