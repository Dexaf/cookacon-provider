import express from "express";
import { errorHandlingRoutine, validationHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import { SearchByTitleReq, SearchDtoReq, SearchSuggestionDtoReq } from "../models/dto/req/feed.dto.req.js";
import { RecipeModel } from "../models/schemas/recipes.schemas.js";
import { Recipe } from "../models/interfaces/recipes.interfaces.js";
import { getfieldName } from "../utils/getFieldName.js";
import { RecipeViewsModel } from "../models/schemas/recipesViews.schemas.js";
import { CustomRequest } from "../models/extensions/request.extension.js";
import { UserSocialModel } from "../models/schemas/userSocial.schemas.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import { envs } from "../config.js";

export const searchSuggestion = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const query = req.query as unknown as SearchSuggestionDtoReq;
    const searchedWord = query.searchInput.toLowerCase();
    const suggestedSearchQta = parseInt(envs!.MONGODB_USER);

    const words = searchedWord.split(" ");
    const regexPattern = words.map(word => `(?=.*${word})`).join("");
    const regex = new RegExp(regexPattern, "i");

    const foundRecipes = await RecipeViewsModel
      .find({ title: regex })
      .select(getfieldName<Recipe>('title'))
      .limit(suggestedSearchQta)
      .sort({ views: "desc" })

    res.status(foundRecipes.length > 0 ? 200 : 204).send(foundRecipes);
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const searchByTitle = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const query = req.query as unknown as SearchByTitleReq;
    const quantity = query.quantity ?? 10;
    const page = +query.page;
    const searchedWord = query.searchInput.toLowerCase();

    const words = searchedWord.split(" ");
    const regexPattern = words.map(word => `(?=.*${word})`).join("");
    const regex = new RegExp(regexPattern, "i");

    const foundRecipes = await RecipeViewsModel
      .find({ title: regex })
      .skip(page * quantity)
      .limit(quantity)
      .populate({ path: "recipeId" }) //FIXME - fix magic string
      .sort({ views: "desc" })

    res.status(foundRecipes.length === 0 ? 204 : 200).send(foundRecipes);
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const mostPopular = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);
    const query = req.query as unknown as SearchDtoReq;
    const quantity = query.quantity ?? 10;
    const page = +query.page;

    const foundRecipes = await RecipeViewsModel.find()
      .skip(page * quantity)
      .limit(quantity)
      .populate({ path: "recipeId" }) //FIXME - fix magic string
      .sort({ views: "desc" })

    res.status(foundRecipes.length === 0 ? 204 : 200).send(foundRecipes);
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const general = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);
    const query = req.query as unknown as SearchDtoReq;
    const quantity = query.quantity ?? 10;
    const page = +query.page;

    const foundRecipes = await RecipeViewsModel
      .find()
      .skip(page * quantity)
      .limit(quantity)
      .populate({ path: "recipeId" }) //FIXME - fix magic string
    res.status(foundRecipes.length === 0 ? 204 : 200).send(foundRecipes);

  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const personal = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const userId = req.user!.id;
    const userSocial = await UserSocialModel.findOne({ userId: userId });
    if (!userSocial)
      throw new ErrorExt('USERSOCIAL_NO_MATCH', 404);

    const query = req.query as unknown as SearchDtoReq;
    const quantity = query.quantity ?? 10;
    const page = +query.page;

    const foundRecipes = await RecipeModel
      .find({ userId: { $in: userSocial.followedIds } })
      .skip(page * quantity)
      .limit(quantity)
      .populate({
        path: "userId",
        select: ["_id", "username", "profilePictureUrl", "name", "surname"]
      }) //FIXME - fix magic string

    res.status(foundRecipes.length === 0 ? 204 : 200).send(foundRecipes);
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}