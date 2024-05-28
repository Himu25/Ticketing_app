import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/users/signout", (req: Request, res: Response) => {
  req.session = null;
  res.json({});
});

export { router as signoutRoute };
