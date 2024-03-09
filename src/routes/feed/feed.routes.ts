import express from "express";
import * as feedController from "../../controllers/feed.controller.js"
import * as feedValidationChains from "../../validation-chains/feed.validation-chains.js"
import { isAuthGuard } from "../../guards/auth.guard.js";

const feedRouter = express.Router();

feedRouter.get('/searchSuggestion', feedValidationChains.searchSuggestion, feedController.searchSuggestion);
feedRouter.get('/searchByTitle', feedValidationChains.searchByTitle, feedController.searchByTitle);
feedRouter.get('/mostPopular', feedValidationChains.pagination, feedController.mostPopular);
feedRouter.get('/general', feedValidationChains.pagination, feedController.general);
feedRouter.get('/personal', isAuthGuard, feedValidationChains.pagination, feedController.personal);
feedRouter.get('/own', isAuthGuard, feedValidationChains.pagination, feedController.own);
feedRouter.get('/:userId', feedValidationChains.pagination, feedController.user);

export default feedRouter;