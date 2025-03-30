import express, { Router } from "express";
import {
  actorSearch,
  getCoActors,
  getFrequentCollaborators,
} from "../controllers/actorsController.js";
import { findCoActors } from "../services/actorsService.js";

const actorsRouter = express.Router();

actorsRouter.get("/co-actors", getCoActors);
actorsRouter.get("/:actorId/collaborators", getFrequentCollaborators);

actorsRouter.get("/search", actorSearch);

export default actorsRouter;
