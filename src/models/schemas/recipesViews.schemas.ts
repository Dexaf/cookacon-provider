import mongoose from "mongoose";
import { recipeSchemaName } from "./recipes.schemas.js";

export const recipesViewsName = "recipesViews";

const recipesViews = new mongoose.Schema({
  _id: ({
    type: mongoose.Types.ObjectId,
    required: true
  }),
  recipesId: ({
    type: mongoose.Types.ObjectId,
    ref: recipeSchemaName
  }),
  views: ({
    type: Number,
    default: 0
  }),
  uploadData: {
    type: Date,
    required: true
  }
})

export const RecipeViewsModel = mongoose.model(recipesViewsName, recipesViews);