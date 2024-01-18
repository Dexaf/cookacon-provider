import express from "express";
import mongoose from "mongoose";
import { promises as fsPromises } from 'fs';
import path from "path";

import { CustomRequest } from "../models/extensions/request.extension.js";
import { errorHandlingRoutine, validationHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import { AddRecipeDtoReq } from "../models/dto/req/recipes.dto.req.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import { RecipeModel } from "../models/schemas/recipes.schemas.js";
import { base64MimeType } from "../utils/getBase64MimeType.js";
import { savePicture } from "../utils/savePicture.js";

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

    const recipeRelativePath = `\\public\\${user.id}\\recipes\\${recipe.title}`;
    const projectRoot = path.resolve(process.cwd());
    await fsPromises.mkdir(projectRoot + recipeRelativePath);
    const savePicturePromises: Promise<void>[] = [];

    //RECIPE PICTURES
    if (body.mainPictureBase64) {
      const imageExtension = base64MimeType(body.mainPictureBase64);
      recipe.mainPictureUrl = recipeRelativePath + `\\pic.${imageExtension.split("/")[1]}`;
      savePicturePromises.push(savePicture(body.mainPictureBase64, projectRoot + recipe.mainPictureUrl));
    }

    //INGREDIENTS PICTURES
    for (let i = 0; i < body.ingredients.length; i++) {
      if (body.ingredients[i].pictureBase64) {
        const imageExtension = base64MimeType(body.ingredients[i].pictureBase64!);
        recipe.ingredients[i].pictureUrl = recipeRelativePath + `\\${body.ingredients[i].name}.${imageExtension.split("/")[1]}`
        savePicturePromises.push(savePicture(body.ingredients[i].pictureBase64!, projectRoot + recipe.ingredients[i].pictureUrl));
      }
    }

    //STEPS PICTURES
    for (let i = 0; i < body.steps.length; i++) {
      if (body.steps[i].pictureBase64) {
        const imageExtension = base64MimeType(body.steps[i].pictureBase64!);
        recipe.steps[i].pictureUrl = recipeRelativePath + `\\${body.steps[i].title}.${imageExtension.split("/")[1]}`
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
    res.json(recipes).status(200).send();
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
    res.json(recipe).status(200).send();
  } catch (error) {
    errorHandlingRoutine(error, next)
  }
}

export const getUserRecipes = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);
    const userId = req.params.userId;

    const recipes = await RecipeModel.find({ userId: userId });
    res.json(recipes).status(200).send();
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
    res.json(recipe).status(200).send();
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