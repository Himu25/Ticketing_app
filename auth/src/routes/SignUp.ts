import express, { Request, Response } from "express";
import { body } from "express-validator";
import { signUpInput } from "../dto/signIn.dto";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { validationMiddleware, BadRequestError } from "@tiknow/common";


const router = express.Router();

router.post(
  "/api/users/signUp",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Password must be greater than 6 characters"),
  ],
  validationMiddleware,
  async (req: Request<{}, {}, signUpInput>, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user !== null) {
      throw new BadRequestError("Email is Already Registered");
    }
    const newUser = User.build({
      email: email,
      password: password,
    });
    const userJwt = jwt.sign(
      { email: email, id: newUser._id },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    await newUser.save();
    res.status(201).json(newUser);
  }
);

export { router as signUpRouter };
