import mongoose, { Document } from "mongoose";
import { Password } from "../services/password";

interface UserAttr {
  email: string;
  password: string;
}

interface UserDoc extends Document {
  email: string;
  password: string;
}

interface UserModal extends mongoose.Model<UserDoc> {
  build(attr: UserAttr): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPass = await Password.hashPassword(this.get("password"));
    this.set("password", hashedPass);
  }
  done();
});

userSchema.statics.build = (attr: UserAttr) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModal>("User", userSchema);

export { User };
