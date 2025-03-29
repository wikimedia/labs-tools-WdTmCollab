import { Request, Response } from "express";
import { getSharedProductionsFunc } from "../services/productionService.js";
export async function getSharedProductionsController(
  req: Request,
  res: Response,
) {
  const actor1 = req.query.actor1Id as string;
  const actor2 = req.query.actor2Id as string;
  const result = await getSharedProductionsFunc(actor1, actor2);
  res.json(result);
}
