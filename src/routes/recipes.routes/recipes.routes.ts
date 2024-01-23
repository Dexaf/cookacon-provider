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
//delete certains recipes of authenticated account 
recipesRouter.delete('/Own/:recipeId', isAuthGuard, recipesController.deleteOwnRecipe);

//update a certain recipe of an authenticated account
recipesRouter.patch('/Own/:recipeId', isAuthGuard, recipeValidationChains.updateRecipe, recipesController.updateOwnRecipe);

//INGREDIENTS
//update an ingredient of a recipe of an authenticated account
recipesRouter.patch('/Own/:recipeId/Ingredient/:ingredientId', isAuthGuard, recipeValidationChains.updateIngredient, recipesController.updateOwnRecipeIngredient);
//delete an ingredient of a recipe of an authenticated account
recipesRouter.delete('/Own/:recipeId/Ingredient/:ingredientId', isAuthGuard, recipesController.deleteOwnRecipeIngredient);

//STEPS
//update a step of a recipe of an authenticated account
recipesRouter.patch('/Own/:recipeId/Step/:stepId', isAuthGuard, recipeValidationChains.updateStep, recipesController.updateOwnRecipeStep);
//delete a step of a recipe of an authenticated account
recipesRouter.delete('/Own/:recipeId/Step/:stepId', isAuthGuard, recipesController.deleteOwnRecipeStep);

//get all recipes of an account
recipesRouter.get('/:userId/', recipesController.getUserRecipes);
//get a certain recipe of an account
recipesRouter.get('/:userId/:recipeId', recipesController.getUserRecipe);


export default recipesRouter;