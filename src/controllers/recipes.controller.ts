import express from "express";
import mongoose from "mongoose";
import { promises as fsPromises } from 'fs';
import path from "path";

import { CustomRequest } from "../models/extensions/request.extension.js";
import { errorHandlingRoutine, validationHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import { AddRecipeDtoReq, UpdateRecipeDtoReq } from "../models/dto/req/recipes.dto.req.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import { RecipeModel } from "../models/schemas/recipes.schemas.js";
import { base64MimeType } from "../utils/getBase64MimeType.js";
import { savePicture } from "../utils/savePicture.js";
import { Ingredient, Step } from "../models/interfaces/recipes.interfaces.js";

export const addRecipe = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const user = await UserModel.findById(req.user!.id);
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const body: AddRecipeDtoReq = req.body;

    const recipe = new RecipeModel({
      _id: new mongoose.Types.ObjectId(),
      userId: user._id,
      title: body.title,
      uploadData: new Date(),
      description: body.description,
      ingredients: body.ingredients,
      minQta: body.minQta,
      steps: body.steps
    })

    const recipeRelativePath = `\\public\\${user.id}\\recipes\\${recipe._id}`;
    const projectRoot = path.resolve(process.cwd());
    await fsPromises.mkdir(projectRoot + recipeRelativePath);
    const savePicturePromises: Promise<void>[] = [];

    //RECIPE PICTURES
    if (body.mainPictureBase64) {
      const imageExtension = base64MimeType(body.mainPictureBase64);
      recipe.mainPictureUrl = recipeRelativePath + `\\${recipe._id}.${imageExtension.split("/")[1]}`;
      savePicturePromises.push(savePicture(body.mainPictureBase64, projectRoot + recipe.mainPictureUrl));
    }

    //INGREDIENTS PICTURES
    for (let i = 0; i < body.ingredients.length; i++) {
      if (body.ingredients[i].pictureBase64) {
        const imageExtension = base64MimeType(body.ingredients[i].pictureBase64!);
        recipe.ingredients[i].pictureUrl = recipeRelativePath + `\\${recipe.ingredients[i]._id}.${imageExtension.split("/")[1]}`
        savePicturePromises.push(savePicture(body.ingredients[i].pictureBase64!, projectRoot + recipe.ingredients[i].pictureUrl));
      }
    }

    //STEPS PICTURES
    for (let i = 0; i < body.steps.length; i++) {
      if (body.steps[i].pictureBase64) {
        const imageExtension = base64MimeType(body.steps[i].pictureBase64!);
        recipe.steps[i].pictureUrl = recipeRelativePath + `\\${recipe.steps[i]._id}.${imageExtension.split("/")[1]}`
        savePicturePromises.push(savePicture(body.steps[i].pictureBase64!, projectRoot + recipe.steps[i].pictureUrl));
      }
    }

    await recipe.save();
    await Promise.all(savePicturePromises);
    res.status(200).send();
  } catch (error: any) {
    errorHandlingRoutine(error, next);
  }
}

export const getOwnRecipes = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const user = await UserModel.findById(req.user!.id);
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const recipes = await RecipeModel.find({ userId: user._id });
    res.send(recipes);
  } catch (error) {
    errorHandlingRoutine(error, next)
  }
}

export const getOwnRecipe = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const user = await UserModel.findById(req.user!.id);
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const recipeId = req.params.recipeId;

    const recipe = await RecipeModel.findOne({ $and: [{ userId: user._id }, { _id: recipeId }] });
    res.send(recipe);
  } catch (error) {
    errorHandlingRoutine(error, next)
  }
}

export const getUserRecipes = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);
    const userId = req.params.userId;

    const recipes = await RecipeModel.find({ userId: userId });
    res.send(recipes);
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const getUserRecipe = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);
    const userId = req.params.userId;
    const recipeId = req.params.recipeId;

    const recipe = await RecipeModel.findOne({ $and: [{ userId: userId }, { _id: recipeId }] });
    res.send(recipe);
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const deleteOwnRecipe = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);
    const user = await UserModel.findById(req.user!.id);
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const recipeId = req.params.recipeId;
    const isDeleted = await RecipeModel.deleteOne({ $and: [{ _id: recipeId }, { userId: user._id }] })
    if (isDeleted.deletedCount === 0)
      throw new ErrorExt("RECIPE_NO_MATCH", 404)
    else
      res.status(204).send()
  } catch (error) {
    errorHandlingRoutine(error, next);

  }
}

export const updateOwnRecipe = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req)

    const user = await UserModel.findById(req.user!.id);
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const recipeId = req.params.recipeId;
    const body: UpdateRecipeDtoReq = req.body;

    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe)
      throw new ErrorExt("RECIPE_NO_MATCH", 404);

    let savePicturePromise: Promise<void> | null = null;
    let oldPath: string | null = null;
    if (body.mainPictureBase64) {
      const recipeRelativePath = `\\public\\${user.id}\\recipes\\${recipe._id}`;
      const projectRoot = path.resolve(process.cwd());
      const imageExtension = base64MimeType(body.mainPictureBase64);

      oldPath = projectRoot + recipe.mainPictureUrl;
      recipe.mainPictureUrl = recipeRelativePath + `\\pic.${imageExtension.split("/")[1]}`;

      //NOTE - extension may change, in that case we need to delete the old pic path
      if (oldPath === projectRoot + recipe.mainPictureUrl)
        oldPath = null

      savePicturePromise = savePicture(body.mainPictureBase64, projectRoot + recipe.mainPictureUrl);
    }

    recipe.title = body.title ?? recipe.title;
    recipe.description = body.description ?? recipe.description;
    recipe.minQta = body.minQta ?? recipe.minQta;

    recipe.save();

    if (savePicturePromise) {
      await Promise.resolve(savePicturePromise);
      if (oldPath)
        await fsPromises.rm(oldPath);
    }

    res.status(200).send();
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const updateOwnRecipeIngredient = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req)

    const user = await UserModel.findById(req.user!.id);
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const recipeId = req.params.recipeId;
    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe)
      throw new ErrorExt("RECIPE_NO_MATCH", 404);

    const ingredientId = req.params.ingredientId;
    const ingredientIndex = recipe.ingredients.findIndex(i => i.id === ingredientId)
    if (ingredientIndex === -1)
      throw new ErrorExt("INGREDIENT_NO_MATCH", 404);

    const ingredient = recipe.ingredients[ingredientIndex];
    const body = req.body as Partial<Ingredient>;

    ingredient.name = body.name ?? ingredient.name;
    ingredient.qta = body.qta ?? ingredient.qta;

    let savePicturePromise: Promise<void> | null = null;
    let oldPath: string | null = null;
    if (body.pictureBase64) {
      const recipeRelativePath = `\\public\\${user.id}\\recipes\\${recipe._id}`;
      const projectRoot = path.resolve(process.cwd());
      const imageExtension = base64MimeType(body.pictureBase64!);

      oldPath = projectRoot + ingredient.pictureUrl;
      ingredient.pictureUrl = recipeRelativePath + `\\${ingredient._id}.${imageExtension.split("/")[1]}`

      //NOTE - extension may change, in that case we need to delete the old pic path
      if (oldPath === projectRoot + ingredient.pictureUrl)
        oldPath = null

      savePicturePromise = savePicture(body.pictureBase64!, projectRoot + ingredient.pictureUrl);
    }

    recipe.ingredients[ingredientIndex] = ingredient;
    recipe.save();

    if (savePicturePromise) {
      await Promise.resolve(savePicturePromise);
      if (oldPath)
        await fsPromises.rm(oldPath);
    }

    res.status(200).send();
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const updateOwnRecipeStep = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req)

    const user = await UserModel.findById(req.user!.id);
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const recipeId = req.params.recipeId;
    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe)
      throw new ErrorExt("RECIPE_NO_MATCH", 404);

    const stepId = req.params.stepId;
    const stepIndex = recipe.steps.findIndex(i => i.id === stepId)
    if (stepIndex === -1)
      throw new ErrorExt("STEP_NO_MATCH", 404);

    const step = recipe.steps[stepIndex];
    const body = req.body as Partial<Step>;

    step.title = body.title ?? step.title;
    step.description = body.description ?? step.description;

    let savePicturePromise: Promise<void> | null = null;
    let oldPath: string | null = null;
    if (body.pictureBase64) {
      const recipeRelativePath = `\\public\\${user.id}\\recipes\\${recipe._id}`;
      const projectRoot = path.resolve(process.cwd());
      const imageExtension = base64MimeType(body.pictureBase64!);

      oldPath = projectRoot + step.pictureUrl;
      step.pictureUrl = recipeRelativePath + `\\${step._id}.${imageExtension.split("/")[1]}`

      //NOTE - extension may change, in that case we need to delete the old pic path
      if (oldPath === projectRoot + step.pictureUrl)
        oldPath = null

      savePicturePromise = savePicture(body.pictureBase64!, projectRoot + step.pictureUrl);
    }

    recipe.steps[stepIndex] = step;
    recipe.save();

    if (savePicturePromise) {
      await Promise.resolve(savePicturePromise);
      if (oldPath)
        await fsPromises.rm(oldPath);
    }

    res.status(200).send();
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const deleteOwnRecipeIngredient = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const user = UserModel.findById(req.user!.id);
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const recipeId = req.params.recipeId;
    const ingredientId = req.params.ingredientId;

    const result = await RecipeModel.updateOne(
      { _id: recipeId },
      { $pull: { ingredients: { _id: ingredientId } } },
      { multi: false }
    );

    if (result.modifiedCount < 1)
      throw new ErrorExt("STEP_NO_MATCH", 404)

    res.status(200).send();
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const deleteOwnRecipeStep = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const user = UserModel.findById(req.user!.id);
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const recipeId = req.params.recipeId;
    const stepId = req.params.stepId;

    const result = await RecipeModel.updateOne(
      { _id: recipeId },
      { $pull: { steps: { _id: stepId } } },
      { multi: false }
    );

    if (result.modifiedCount < 1)
      throw new ErrorExt("STEP_NO_MATCH", 404)

    res.status(200).send();
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
} 