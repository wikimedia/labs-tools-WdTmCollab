import express, { Router } from "express";
import {
  getFrequentCollaborators,
  getSharedProductions,
} from "../controllers/actorsController.js";
export const actorsRouter: Router = express.Router();

actorsRouter.get("/:actorId/collaborators", getFrequentCollaborators);
actorsRouter.get("/:actorId/shared-with/:actorId2", getSharedProductions);
