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
import { envs } from "../config.js";

export const searchSuggestion = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const query = req.query as unknown as SearchSuggestionDtoReq;

    const searchedWord = query.searchInput.toLowerCase();
    const suggestedTitles: string[] = []
    const suggestedSearchQta = parseInt(envs!.MONGODB_USER);
    const titles = (await RecipeModel.find({}).select("-_id " + getfieldName<Recipe>("title"))).map(r => { return r.title.toLowerCase() })

    for (let i = 0; i < titles.length; i++) {
      if (titles[i] === searchedWord) {
        suggestedTitles.push(titles[i]);
        titles.splice(i, 1);
        break;
      }
    }

    const wordsInSW = searchedWord.replace(',', '').split(" ").filter(w => w.length > 2).sort((a, b) => (b.length < a.length) ? -1 : (b.length === a.length) ? 0 : 1);

    for (let i = 0; i < wordsInSW.length && suggestedTitles.length < suggestedSearchQta; i++) {
      const rasonableLength = Math.floor(wordsInSW[i].length / 2);

      for (let j = wordsInSW[i].length; j > rasonableLength && suggestedTitles.length < suggestedSearchQta; j--) {
        const searchedSubWord = wordsInSW[i].substring(0, j);

        for (let k = 0; k < titles.length && suggestedTitles.length < suggestedSearchQta; k++) {
          if (titles[k].includes(searchedSubWord)) {
            suggestedTitles.push(titles[k]);
            titles.splice(k, 1);
            k--;
          }
        }
      }
    }

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