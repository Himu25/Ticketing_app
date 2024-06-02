import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  orderStatues,
  requireAuth,
  validationMiddleware,
} from "@tiknow/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/orders";
import { stripe } from "../stripe";
import { Payment } from "../models/payments";
import { PaymentCreatedPublisher } from "../events/Publisher/payment-created";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").notEmpty(), body("orderId").notEmpty()],
  validationMiddleware,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const userid = req.currentUser!.id;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    if (order.userId !== userid) {
      throw new NotAuthorizedError();
    }
    if (order.status === orderStatues.Cancelled) {
      throw new BadRequestError("Order is Expired");
    }
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: parseFloat(order.price) * 100,
      source: token,
    });
    const payment = Payment.build({
      orderId: orderId,
      stripeId: charge.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).onPublish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.json({ message: "Payment successful" });
  }
);

export { router as chargeRouter };
