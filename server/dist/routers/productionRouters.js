import express from "express";
import { getSharedActorsController, getSharedProductionsController, } from "../controllers/productionsController.js";
const productionRouter = express.Router();
productionRouter.get("/shared", getSharedProductionsController);
productionRouter.get("/shared-actors", getSharedActorsController);
export default productionRouter;
