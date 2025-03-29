import express, { Router } from "express";
import { getSharedProductionsController } from "../controllers/productionsController.js";

const productionRouter: Router = express.Router();
productionRouter.get("/shared", getSharedProductionsController);
export default productionRouter;
