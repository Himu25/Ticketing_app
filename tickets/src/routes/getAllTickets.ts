import express, { Request, Response } from "express";
import { ROUTE } from "../constants/route";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get(ROUTE, async(req: Request, res: Response) => {
  const Tickets = await Ticket.find({})
  res.json({Tickets})
});

export {router as getAllTicketsRouter}