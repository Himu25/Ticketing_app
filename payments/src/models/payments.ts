import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttr {
 orderId: string,
 stripeId: string,
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  version: number
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attr: PaymentAttr): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
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

paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attr: PaymentAttr) => {
  return new Payment(attr);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema);

export { Payment };
