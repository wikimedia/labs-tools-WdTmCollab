import express from "express";
import { actorSearch, getAllActors, getCoActors, getFrequentCollaborators, } from "../controllers/actorsController.js";
const actorsRouter = express.Router();
actorsRouter.get("/", getAllActors);
actorsRouter.get("/co-actors", getCoActors);
actorsRouter.get("/:actorId/collaborators", getFrequentCollaborators);
actorsRouter.get("/search", actorSearch);
export default actorsRouter;
