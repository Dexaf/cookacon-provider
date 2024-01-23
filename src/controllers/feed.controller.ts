import express from "express";
import { errorHandlingRoutine, validationHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import { SearchSuggestionDtoReq } from "../models/dto/req/feed.dto.req.js";
import { RecipeModel } from "../models/schemas/recipes.schemas.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import mongoose from "mongoose";
import { Recipe } from "../models/interfaces/recipes.interfaces.js";
import { getfieldName } from "../utils/getFieldName.js";

//TODO - Improve reliability
export const searchSuggestion = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const query = req.query as unknown as SearchSuggestionDtoReq;

    const searchInput = query.searchInput;
    const includeQuarters = query.includeQuarters;

    const recipesRet: string[] = []

    const recipes = await RecipeModel.find({}).select("-_id " + getfieldName<Recipe>("title"))

    const perfectMatch: string[] = [];
    const halfMatch: string[] = [];
    const threeQuarteMatch: string[] = [];

    for (const recipe of recipes) {
      if (recipe.title.includes(searchInput))
        perfectMatch.push(recipe.title)
      else if (includeQuarters) {
        if (searchInput.length > 2 && recipe.title.includes(searchInput.substring(0, Math.ceil((searchInput.length / 4) * 2))))
          halfMatch.push(recipe.title)
        else if (searchInput.length > 4 && recipe.title.includes(searchInput.substring(0, Math.ceil((searchInput.length / 4) * 3))))
          threeQuarteMatch.push(recipe.title)
      }

      if ((perfectMatch.length + halfMatch.length + threeQuarteMatch.length) > 9)
        break;
    }

    recipesRet.push(...perfectMatch, ...halfMatch, ...threeQuarteMatch);
    const status = recipesRet.length > 0 ? 200 : 204;
    res.status(status).json(recipesRet);
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const mostPopular = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

}

export const general = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

}

export const personal = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

}