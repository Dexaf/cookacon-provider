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