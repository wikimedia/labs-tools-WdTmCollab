import { Request, Response } from "express";
import {
  findCoActors,
  searchWikidataActor,
} from "../services/actorsService.js";

export function getFrequentCollaborators(req: Request, res: Response) {
  res.send("getting frequent collaborators");
}

export function getSharedProductions(req: Request, res: Response) {
  res.send("getting frequent collaborators");
}

export function getCoActors(req: Request, res: Response) {
  return findCoActors(req.body.actorId);
}

export function searchActor(req: Request, res: Response) {
  return searchWikidataActor(req.params.name);
}
