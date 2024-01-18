import express from "express";
import { isAuthGuard } from "../../guards/auth.guard.js";
import * as recipesController from "../../controllers/recipes.controller.js"
import * as recipeValidationChains from "../../validation-chains/recipes.validation-chains.js"
const recipesRouter = express.Router();

//add new recipe
recipesRouter.post('/Add', isAuthGuard, recipeValidationChains.addRecipe, recipesController.addRecipe);
//get all recipe of authenticated account
recipesRouter.get('/Own', isAuthGuard, recipesController.getOwnRecipes);
//get a certain recipe of authenticated account
recipesRouter.get('/Own/:recipeId', isAuthGuard, recipesController.getOwnRecipe);
//get all recipe of an account
recipesRouter.get('/:userId/', recipesController.getUserRecipes);
//get a certain recipe of an account
recipesRouter.get('/:userId/:recipeId', recipesController.getUserRecipe);
//update a certain recipe of an account
recipesRouter.patch('/:recipeId', isAuthGuard); //TODO - update only first layer of doc, leave ingrd and steps for other end points
//delete certains recipes of authenticated account 
recipesRouter.delete('/:recipeId', isAuthGuard, recipesController.deleteOwnRecipe);

export default recipesRouter;