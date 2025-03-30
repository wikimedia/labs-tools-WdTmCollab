import { Request, Response } from "express";
import {
  getSharedActorsFunc,
  getSharedProductionsFunc,
  searchWikidataMedia,
} from "../services/productionService.js";
export async function getSharedProductionsController(
  req: Request,
  res: Response,
) {
  const actor1 = req.query.actor1Id as string;
  const actor2 = req.query.actor2Id as string;
  const result = await getSharedProductionsFunc(actor1, actor2);
  res.json(result);
}

export async function getSharedActorsController(req: Request, res: Response) {
  const movie1 = req.query.movie1 as string;
  const movie2 = req.query.movie2 as string;
  const result = await getSharedActorsFunc(movie1, movie2);
  res.json(result);
}

export async function searchMedia(req: Request, res: Response) {
  const title = req.query.movie1 as string;
  const result = await searchWikidataMedia(title);
  res.json(result);
}
