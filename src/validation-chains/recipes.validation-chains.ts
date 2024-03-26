import ev from "express-validator";

import { AddRecipeDtoReq, UpdateRecipeDtoReq } from "../models/dto/req/recipes.dto.req.js";
import { getfieldName } from "../utils/getFieldName.js";
import { RecipeModel } from "../models/schemas/recipes.schemas.js";
import { CustomRequest } from "../models/extensions/request.extension.js";
import { base64MimeType } from "../utils/getBase64MimeType.js";
import { Ingredient, Step } from "../models/interfaces/recipes.interfaces.js";
import { RecipeType } from "../models/enum/recipe-type.js";


export const addRecipe = [
  ev.body()
    .custom((recipe: AddRecipeDtoReq) => Object.keys(recipe).length > 0)
    .withMessage({ message: "EMPTY_BODY", errorCode: 422 }),
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
          if (!i.name || i.name.length < 1)
            throw new Error("INGREDIENT_NAME_WRONG");
          if (!i.qta || i.qta.length < 1)
            throw new Error("INGREDIENT_QTA_WRONG");
          if (!isQta.test(i.qta))
            throw new Error("QTA_FORMAT_WRONG");
          if (i.pictureBase64)
            base64MimeType(i.pictureBase64)
        })
        return true;
      } catch (error) {
        throw new Error("an ingredient is malformed");
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
          if (!s.title || s.title.length < 1)
            throw new Error("STEP_TITLE_WRONG");
          if (!s.description || s.description.length < 1)
            throw new Error("STEP_DESCRIPTION_WRONG");
          if (s.pictureBase64)
            base64MimeType(s.pictureBase64)
        })
        return true;
      } catch (error) {
        throw new Error("a step is malformed");
      }
    })
    .withMessage({ message: "STEP_PARAMS_MALFORMED", errorCode: 400 }),
  ev.body(getfieldName<AddRecipeDtoReq>("type"))
    .custom((type: string) => {
      if (type in RecipeType)
        return true;
      else
        throw new Error("TYPE_MALFORMED");
    })
    .withMessage({ message: "TYPE_WRONG", errorCode: 422 }),
  ev.body(getfieldName<AddRecipeDtoReq>("cookingTime"))
    .custom((cookingTime: string) => {
      const regex = new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      if (regex.test(cookingTime))
        return true
      else
        throw new Error("COOKING_TIME_MALFORMED");
    })
    .withMessage({ message: "COOKING_TIME_MALFORMED", errorCode: 422 }),
]

export const updateRecipe = [
  ev.body()
    .custom((recipe: UpdateRecipeDtoReq) => Object.keys(recipe).length > 0)
    .withMessage({ message: "EMPTY_BODY", errorCode: 422 }),
  ev.body(getfieldName<UpdateRecipeDtoReq>("title"))
    .optional()
    .isLength({ min: 1 })
    .withMessage({ message: "TITLE_IS_EMPTY_STRING", errorCode: 422 })
    .custom(async (title: string, { req }) => {
      const cr = req as CustomRequest
      const match = await RecipeModel.findOne({ $and: [{ title: title }, { userId: cr.user!.id }] })
      if (match !== null)
        throw new Error('Recipe with this name already exists for this account');
      else
        return true;
    })
    .withMessage({ message: "RECIPE_TITLE_DUPLICATE_FOR_ACCOUNT", errorCode: 409 }),
  ev.body(getfieldName<UpdateRecipeDtoReq>("description"))
    .optional()
    .isLength({ min: 1 })
    .withMessage({ message: "DESCRIPTION_IS_EMPTY_STRING", errorCode: 422 }),
  ev.body(getfieldName<UpdateRecipeDtoReq>("minQta"))
    .optional()
    .isInt({ min: 1 })
    .withMessage({ message: "MINQTA_ISNT_POSITIVE_INTEGER", errorCode: 422 }),
  ev.body(getfieldName<UpdateRecipeDtoReq>("mainPictureBase64"))
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
  ev.body(getfieldName<UpdateRecipeDtoReq>("type"))
    .optional()
    .custom((type: string) => {
      if (type in RecipeType)
        return true;
      else
        throw new Error("TYPE_MALFORMED");
    })
    .withMessage({ message: "TYPE_WRONG", errorCode: 422 }),
  ev.body(getfieldName<UpdateRecipeDtoReq>("cookingTime"))
    .optional()
    .custom((cookingTime: string) => {
      const regex = new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      if (regex.test(cookingTime))
        return true
      else
        throw new Error("COOKING_TIME_MALFORMED");
    })
    .withMessage({ message: "COOKING_TIME_MALFORMED", errorCode: 422 }),
]

export const updateIngredient = [
  ev.body()
    .custom((ingredient: Ingredient) => Object.keys(ingredient).length > 0)
    .withMessage({ message: "EMPTY_BODY", errorCode: 422 }),
  ev.body(getfieldName<Ingredient>("name"))
    .optional()
    .isLength({ min: 1 })
    .withMessage({ message: "NAME_IS_EMPTY_STRING", errorCode: 422 }),
  ev.body(getfieldName<Ingredient>("qta"))
    .optional()
    .isLength({ min: 1 })
    .withMessage({ message: "QTA_IS_EMPTY_STRING", errorCode: 422 })
    .custom((qta: string) => {
      const isQta = new RegExp(/^\s*(\d+(\.\d+)?)\s*([a-zA-Z]+)\s*$/);
      if (!isQta.test(qta))
        throw new Error("qta format wrong");
      return true;
    })
    .withMessage({ message: "QTA_FORMAT_WRONG", errorCode: 422 }),
  ev.body(getfieldName<Ingredient>("pictureBase64"))
    .optional()
    .custom((pictureBase64: string) => {
      try {
        base64MimeType(pictureBase64)
        return true;
      } catch (error) {
        throw new Error("picture isn't in base 64");
      }
    })
    .withMessage({ message: "PICTUREBASE64_NOT_BASE64", errorCode: 422 }),
]

export const updateStep = [
  ev.body()
    .custom((step: Step) => Object.keys(step).length > 0)
    .withMessage({ message: "EMPTY_BODY", errorCode: 422 }),
  ev.body(getfieldName<Step>("title"))
    .optional()
    .isLength({ min: 1 })
    .withMessage({ message: "TITLE_IS_EMPTY_STRING", errorCode: 422 }),
  ev.body(getfieldName<Step>("description"))
    .optional()
    .isLength({ min: 1 })
    .withMessage({ message: "DESCRIPTION_IS_EMPTY_STRING", errorCode: 422 }),
  ev.body(getfieldName<Step>("pictureBase64"))
    .optional()
    .custom((pictureBase64: string) => {
      try {
        base64MimeType(pictureBase64)
        return true;
      } catch (error) {
        throw new Error("picture isn't in base 64");
      }
    })
    .withMessage({ message: "PICTUREBASE64_NOT_BASE64", errorCode: 422 }),
]

export const addSteps = [
  ev.body()
    .custom((steps: Step[]) => {
      if (steps.length === 0)
        throw new Error("no steps added");
      steps.forEach(s => {
        if (!s.description || !s.pictureBase64 || !s.title)
          throw new Error("step malformed");
      })
      return true;
    })
    .withMessage({ message: "BODY_MALFORMED", errorCode: 422 }),
]

export const addIngredient = [
  ev.body()
    .custom((steps: Ingredient[]) => {
      if (steps.length === 0)
        throw new Error("no ingredients added");
      steps.forEach(s => {
        if (!s.name || !s.pictureBase64 || !s.qta)
          throw new Error("ingredient malformed");
      })
      return true;
    })
    .withMessage({ message: "BODY_MALFORMED", errorCode: 422 }),
]