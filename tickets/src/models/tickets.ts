import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttr {
  title: string;
  price: string;
  userID: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  userID: string;
  orderID?: string;
  version: number;
}

interface TicketModal extends mongoose.Model<TicketDoc> {
  build(attr: TicketAttr): TicketDoc;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    orderID: {
      type: String,
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

// optimistic concurrency control
TicketSchema.set("versionKey", "version");
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.build = (attr: TicketAttr) => {
  return new Ticket(attr);
};

const Ticket = mongoose.model<TicketDoc, TicketModal>("Ticket", TicketSchema);

export { Ticket };
