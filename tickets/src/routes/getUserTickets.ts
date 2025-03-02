import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";
import { requireAuth, currentUser } from "@tiknow/common";

const router = express.Router();

router.get(
  "/api/tickets/getByUser",
  requireAuth,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      return res.status(401).json({ error: "Not authorized" });
    }

    try {
      const tickets = await Ticket.find({ userID: req.currentUser.id });
      return res.json({ tickets });
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export { router as getUserTickets };
