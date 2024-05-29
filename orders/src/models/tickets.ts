import mongoose from "mongoose";
import { Order } from "./orders";
import { orderStatues } from "@tiknow/common";

interface ticketAttr {
  title: string;
  price: string;
}
export interface ticketDoc extends mongoose.Document {
  title: string;
  price: string;
  isReserved():Promise<boolean>;
}

interface ticketModel extends mongoose.Model<ticketDoc> {
  build(attr: ticketAttr): ticketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketSchema.statics.build = (attr: ticketAttr) => {
  return new Ticket(attr);
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        orderStatues.Created,
        orderStatues.Completed,
        orderStatues.AwaitingPayment,
      ],
    },
  });
  return !!existingOrder;
};

export const Ticket = mongoose.model<ticketDoc, ticketModel>(
  "Ticket",
  ticketSchema
);
