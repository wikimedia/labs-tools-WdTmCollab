import express, { Router } from 'express';
import {
  getSharedActorsController,
  getSharedProductionsController,
  searchMedia,
} from '../controllers/productionsController.js';

const productionRouter: Router = express.Router();
productionRouter.get('/shared', getSharedProductionsController);
productionRouter.get('/shared-actors', getSharedActorsController);
productionRouter.get('/search', searchMedia);
export default productionRouter;
