import mongoose, { Schema } from "mongoose";
import { userSchemaName } from "./user.schema.js";

export const recipeSchemaName = "Recipe";

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  qta: {
    type: Number,
    required: true
  },
  pictureUrl: {
    type: String
  }
});

const stepSchema = new mongoose.Schema({
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
    type: String,
    required: true
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
  }
});

export const RecipeModel = mongoose.model(recipeSchemaName, recipeSchema);