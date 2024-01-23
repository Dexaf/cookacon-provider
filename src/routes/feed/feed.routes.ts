import express from "express";
import * as feedController from "../../controllers/feed.controller.js"
import * as feedValidationChains from "../../validation-chains/feed.validation-chains.js"

const feedRouter = express.Router();

feedRouter.get('/search-suggestion', feedValidationChains.searchSuggestion, feedController.searchSuggestion);
feedRouter.get('/most-popular', feedController.mostPopular);
feedRouter.get('/general', feedController.general);
feedRouter.get('/personal', feedController.personal);

export default feedRouter;