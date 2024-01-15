export interface Ingredient {
  name: string;
  qta: number;
  pictureBase64?: string;
}

export interface Step {
  title: string;
  description: string;
  pictureBase64?: string;
}