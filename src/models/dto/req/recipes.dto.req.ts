import { RecipeType } from "../../enum/recipe-type.js";
import { Ingredient, Step } from "../../interfaces/recipes.interfaces.js";

export interface AddRecipeDtoReq {
  title: string;
  description: string;
  mainPictureBase64?: string;
  ingredients: Ingredient[];
  minQta: number;
  type: RecipeType,
  cookingTime: string,
  steps: Step[];
}

export interface UpdateRecipeDtoReq {
  title?: string;
  description?: string;
  mainPictureBase64?: string;
  minQta?: number;
  type?: RecipeType,
  cookingTime?: string,
}