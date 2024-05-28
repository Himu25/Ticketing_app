import mongoose from "mongoose";
import { app } from "./app";

const run = async () => {
 if (!process.env.JWT_KEY || !process.env.MONGO_URL) {
   return console.log("Missing env values");
 }
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }

  app.listen(4000, () => {
    console.log("Running on port 3000");
  });
};

run();
