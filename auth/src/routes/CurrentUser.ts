import express, { Request, Response } from "express";
import { currentUser } from "@tiknow/common";

const router = express.Router();

router.get(
  "/api/users/currentUser",
  currentUser,
  (req: Request, res: Response) => {    
    res.json({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRoute };
