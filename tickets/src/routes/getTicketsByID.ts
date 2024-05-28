import express, { Request, Response } from "express";
import { ROUTE } from "../constants/route";
import { Ticket } from "../models/tickets";
import {  NotFoundError } from "@tiknow/common";

const router = express.Router();

router.get(`${ROUTE}/:id`, async(req: Request, res: Response) => {
  const TicketByID = await Ticket.findById(req.params.id)
  if (!TicketByID) {
    throw new NotFoundError("Ticket not found!")
  }
  res.json(TicketByID)
});

export {router as getTicketsByID}