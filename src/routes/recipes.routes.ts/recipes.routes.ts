import express from "express";
import { isAuthGuard } from "../../guards/auth.guard.js";
import * as recipesController from "../../controllers/recipes.controller.js"

const recipeRouter = express.Router();

//add new recipe
recipeRouter.post('/Add', isAuthGuard, recipesController.addRecipe);
//get all recipe of authenticated account
recipeRouter.get('/Own', isAuthGuard);
//get a certain recipe of authenticated account
recipeRouter.get('/Own/:recipeId', isAuthGuard);
//get all recipe of an account
recipeRouter.get('/:userId/');
//get a certain recipe of an account
recipeRouter.get('/:userId/:recipeId');
//update a certain recipe of an account
recipeRouter.patch('/:recipeId', isAuthGuard);
//delete certains recipes of authenticated account 
recipeRouter.delete('/:recipeId', isAuthGuard);