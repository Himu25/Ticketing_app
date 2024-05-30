import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order } from "./orders";
import { orderStatues } from "@tiknow/common";

interface ticketAttr {
  title: string;
  price: string;
  id: string;
}
export interface ticketDoc extends mongoose.Document {
  title: string;
  price: string;
  version: number;
  isReserved(): Promise<boolean>;
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

// optimistic concurrency control
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attr: ticketAttr) => {
  return new Ticket({
    title: attr.title,
    price: attr.price,
    _id: attr.id,
  });
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
