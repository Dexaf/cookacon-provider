import express from "express";
import { errorHandlingRoutine, validationHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import { SearchDtoReq, SearchSuggestionDtoReq } from "../models/dto/req/feed.dto.req.js";
import { RecipeModel } from "../models/schemas/recipes.schemas.js";
import { Recipe } from "../models/interfaces/recipes.interfaces.js";
import { getfieldName } from "../utils/getFieldName.js";
import { RecipeViewsModel } from "../models/schemas/recipesViews.schemas.js";
import { CustomRequest } from "../models/extensions/request.extension.js";
import { UserSocialModel } from "../models/schemas/userSocial.schemas.js";
import { ErrorExt } from "../models/extensions/error.extension.js";

//TODO - Improve reliability
export const searchSuggestion = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const query = req.query as unknown as SearchSuggestionDtoReq;

    const searchInput = query.searchInput;
    const includeQuarters = query.includeQuarters;

    const suggestedTitles: string[] = []

    const titles = (await RecipeModel.find({}).select("-_id " + getfieldName<Recipe>("title"))).map(r => { return r.title.toLowerCase() })

    const fullMatch: string[] = [];
    const halfMatch: string[] = [];
    const threeQuarteMatch: string[] = [];

    for (const title of titles) {
      if (title.includes(searchInput))
        fullMatch.push(title)
      else if (includeQuarters) {
        if (searchInput.length > 2 && title.includes(searchInput.substring(0, Math.ceil((searchInput.length / 4) * 2))))
          halfMatch.push(title)
        else if (searchInput.length > 4 && title.includes(searchInput.substring(0, Math.ceil((searchInput.length / 4) * 3))))
          threeQuarteMatch.push(title)
      }

      if ((fullMatch.length + halfMatch.length + threeQuarteMatch.length) > 9)
        break;
    }

    suggestedTitles.push(...fullMatch, ...halfMatch, ...threeQuarteMatch);
    const status = suggestedTitles.length > 0 ? 200 : 204;
    res.status(status).send(suggestedTitles);
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