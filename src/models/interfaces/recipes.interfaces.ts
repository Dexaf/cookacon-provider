export interface Ingredient {
  name: string;
  qta: string;
  pictureBase64?: string;
}

export interface Step {
  title: string;
  description: string;
  pictureBase64?: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  mainPictureBase64?: string;
  ingredients: Ingredient[];
  minQta: number;
  steps: Step[];
}