import mongoose, { Schema } from "mongoose";
import { userSchemaName } from "./user.schema.js";
import { RecipeType } from "../enum/recipe-type.js";

export const recipeSchemaName = "Recipe";

const ingredientSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
    auto: true
  },
  name: {
    type: String,
    required: true
  },
  qta: {
    type: String,
    required: true
  },
  pictureUrl: {
    type: String
  }
});

const stepSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
    auto: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pictureUrl: {
    type: String
  }
});

const recipeSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: userSchemaName
  },
  title: {
    type: String,
    required: true
  },
  uploadData: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mainPictureUrl: {
    type: String
  },
  ingredients: {
    type: [ingredientSchema],
    required: true
  },
  minQta: {
    type: Number,
    required: true
  },
  steps: {
    type: [stepSchema],
    required: true
  },
  type: {
    type: String,
    required: true 
  },
  cookingTime: {
    type: String,
    required: true
  }
});

export const RecipeModel = mongoose.model(recipeSchemaName, recipeSchema);