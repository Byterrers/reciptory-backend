import * as mongoose from 'mongoose';

export const RecipesBookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  recipes: { type: [String], required: true },
  userId: { type: String, required: true },
  favorite: { type: Boolean, required: true },
});
