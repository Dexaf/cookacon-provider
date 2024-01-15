import { Ingredient, Step } from "../../interfaces/recipes.interfaces.js";

export interface AddRecipeDtoReq {
  title: string;
  description: string;
  mainPictureBase64: string;
  ingredients: Ingredient[];
  minQta: number;
  steps: Step[];
}

