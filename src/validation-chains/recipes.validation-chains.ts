import ev from "express-validator";

import { AddRecipeDtoReq } from "../models/dto/req/recipes.dto.req.js";
import { getfieldName } from "../utils/getFieldName.js";
import { RecipeModel } from "../models/schemas/recipes.schemas.js";
import { CustomRequest } from "../models/extensions/request.extension.js";
import { base64MimeType } from "../utils/getBase64MimeType.js";
import { Ingredient, Step } from "../models/interfaces/recipes.interfaces.js";


export const addRecipe = [
  ev.body(getfieldName<AddRecipeDtoReq>("title"))
    .exists()
    .withMessage({ message: "MISSING_TITLE", errorCode: 400 })
    .custom(async (title: string, { req }) => {
      const cr = req as CustomRequest
      const match = await RecipeModel.findOne({ $and: [{ title: title }, { userId: cr.user!.id }] })
      if (match !== null)
        throw new Error('Recipe with this name already exists for this account');
      else
        return true;
    })
    .withMessage({ message: "RECIPE_TITLE_DUPLICATE_FOR_ACCOUNT", errorCode: 409 }),
  ev.body(getfieldName<AddRecipeDtoReq>("description"))
    .exists()
    .withMessage({ message: "DESCR_MISSING", errorCode: 400 })
    .isLength({ max: 1000 })
    .withMessage({ message: "DESCR_TOO_LONG", errorCode: 422 }),
  ev.body(getfieldName<AddRecipeDtoReq>("mainPictureBase64"))
    .optional()
    .custom((mainPictureBase64: string) => {
      try {
        base64MimeType(mainPictureBase64)
        return true;
      } catch (error) {
        throw new Error("base 64 isn't a picture")
      }
    })
    .withMessage({ message: "MAIN_PICTURE_BASE64_WASNT_PICTURE", errorCode: 422 }),
  ev.body(getfieldName<AddRecipeDtoReq>("ingredients"))
    .isArray()
    .withMessage({ message: "INGREDIENTS_ISNT_ARRAY", errorCode: 422 })
    .custom((ingredients: Ingredient[]) => {
      try {
        const isQta = new RegExp(/^\s*(\d+(\.\d+)?)\s*([a-zA-Z]+)\s*$/);
        ingredients.forEach(i => {
          if (!i.name || !i.qta)
            throw new Error("name or description missing in ingredient");
          if (!isQta.test(i.qta))
            throw new Error("ingredient qta format is wrong");
          if (i.pictureBase64)
            base64MimeType(i.pictureBase64)
        })
        return true;
      } catch (error) {
        throw new Error("an ingredient as a problem");
      }
    })
    .withMessage({ message: "INGREDIENT_PARAMS_MALFORMED", errorCode: 400 }),
  ev.body(getfieldName<AddRecipeDtoReq>("minQta"))
    .isInt({ min: 1 })
    .withMessage({ message: "MINQTA_ISNT_POSITIVE_INTEGER", errorCode: 422 }),
  ev.body(getfieldName<AddRecipeDtoReq>("steps"))
    .isArray()
    .withMessage({ message: "STEPS_ISNT_ARRAY", errorCode: 422 })
    .custom((steps: Step[]) => {
      try {
        steps.forEach(s => {
          if (!s.title || !s.description) {
            throw new Error("name or description missing in steps");
          }
          if (s.pictureBase64)
            base64MimeType(s.pictureBase64)
        })
        return true;
      } catch (error) {
        throw new Error("a step as a problem");
      }
    })
    .withMessage({ message: "STEP_PARAMS_MALFORMED", errorCode: 400 }),
] 