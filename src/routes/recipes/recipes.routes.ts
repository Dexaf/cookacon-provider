import express from "express";
import { isAuthGuard } from "../../guards/auth.guard.js";
import * as recipesController from "../../controllers/recipes.controller.js"
import * as recipeValidationChains from "../../validation-chains/recipes.validation-chains.js"
const recipesRouter = express.Router();

//add new recipe
recipesRouter.post('/add', isAuthGuard, recipeValidationChains.addRecipe, recipesController.addRecipe);
//get all recipe of authenticated account
recipesRouter.get('/own', isAuthGuard, recipesController.getOwnRecipes);
//get a certain recipe of authenticated account
recipesRouter.get('/own/:recipeId', isAuthGuard, recipesController.getOwnRecipe);
//delete certains recipes of authenticated account 
recipesRouter.delete('/own/:recipeId', isAuthGuard, recipesController.deleteOwnRecipe);

//update a certain recipe of an authenticated account
recipesRouter.patch('/own/:recipeId', isAuthGuard, recipeValidationChains.updateRecipe, recipesController.updateOwnRecipe);

//INGREDIENTS
//update an ingredient of a recipe of an authenticated account
recipesRouter.patch('/own/:recipeId/ingredient/:ingredientId', isAuthGuard, recipeValidationChains.updateIngredient, recipesController.updateOwnRecipeIngredient);
//delete an ingredient of a recipe of an authenticated account
recipesRouter.delete('/own/:recipeId/ingredient/:ingredientId', isAuthGuard, recipesController.deleteOwnRecipeIngredient);
//add ingredients of a recipe of an authenticated account
recipesRouter.post('/own/:recipeId/ingredient/add', isAuthGuard, recipeValidationChains.addIngredient, recipesController.addOwnRecipeIngredients);

//STEPS
//update a step of a recipe of an authenticated account
recipesRouter.patch('/own/:recipeId/step/:stepId', isAuthGuard, recipeValidationChains.updateStep, recipesController.updateOwnRecipeStep);
//delete a step of a recipe of an authenticated account
recipesRouter.delete('/own/:recipeId/step/:stepId', isAuthGuard, recipesController.deleteOwnRecipeStep);
//add steps of a recipe of an authenticated account
recipesRouter.post('/own/:recipeId/step/add', isAuthGuard, recipeValidationChains.addSteps, recipesController.addOwnRecipeSteps);

//get all recipes of an account
recipesRouter.get('/:userId/', recipesController.getUserRecipes);
//get a certain recipe of an account
recipesRouter.get('/:userId/:recipeId', recipesController.getUserRecipe);


export default recipesRouter;