import express, { Router } from "express";
import {
  actorSearch,
  getFrequentCollaborators,
  getSharedProductions,
} from "../controllers/actorsController.js";

const actorsRouter = express.Router();

actorsRouter.get("/search", actorSearch);
actorsRouter.get("/:actorId/collaborators", getFrequentCollaborators);
actorsRouter.get("/:actorId/shared-with/:actorId2", getSharedProductions);

export default actorsRouter;
