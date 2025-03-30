import { Request, Response } from "express";
import {
  findCoActors,
  searchWikidataActor,
} from "../services/actorsService.js";

export function getFrequentCollaborators(req: Request, res: Response) {
  res.send("getting frequent collaborators");
}
export async function getCoActors(req: Request, res: Response) {
  const result = await findCoActors(req.query.actorId);

  res.json(result);
}
//export function actorSearch(req: Request, res: Response) {
//  return searchWikidataActor(req.params.name);
//}
//
export async function actorSearch(req: Request, res: Response): Promise<any> {
  try {
    const name = req.query.name as string | undefined;
    if (!name) {
      return res.status(400).json({ error: "Missing 'name' query parameter" });
    }

    const results = await searchWikidataActor(name);
    //const results: any = [];
    res.json(results); // ✅ Send results to client
  } catch (error) {
    console.error("Error searching actor:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
