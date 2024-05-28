import express, { Request, Response } from "express";
import { signInInput } from "../dto/signIn.dto";
import { body } from "express-validator";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
import { validationMiddleware, BadRequestError } from "@tiknow/common";

const router = express.Router();

router.post(
  "/api/users/signIn",
  [
    body("email").trim().isEmail().withMessage("Invalid Email"),
    body("password").trim().notEmpty().withMessage("Password is Empty"),
  ],
  validationMiddleware,
  async (req: Request<{}, {}, signInInput>, res: Response) => {
    const { email, password } = req.body;

    const userWithThisEmail = await User.findOne({ email });
    if (userWithThisEmail === null) {
      throw new BadRequestError("Invalid credetials");
    }
    const isPassMatched = await Password.comparePassword(
      password,
      userWithThisEmail.password
    );
    if (!isPassMatched) {
      throw new BadRequestError("Invalid credetials");
    }
    const token = jwt.sign(
      { email: email, id: userWithThisEmail._id },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: token,
    };
    res.status(200).json(userWithThisEmail);
  }
);

export { router as signInRouter };
