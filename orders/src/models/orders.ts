import { orderStatues } from "@tiknow/common";
import mongoose from "mongoose";
import { ticketDoc } from "./tickets";

interface orderAttr {
  userID: string;
  status: orderStatues;
  expiresAt: Date;
  ticket: ticketDoc;
}

interface orderDoc extends mongoose.Document {
  userID: string;
  status: orderStatues;
  expiresAt: Date;
  ticket: ticketDoc;
}

interface orderModel extends mongoose.Model<orderDoc> {
  build(attr: orderAttr): orderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(orderStatues),
      default: orderStatues.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

orderSchema.statics.build = (attr: orderAttr) => {
  return new Order(attr);
};

const Order = mongoose.model<orderDoc, orderModel>("Order", orderSchema);

export { Order };
