import * as mongoose from 'mongoose';

export const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cookingTime: { type: String, required: true },
  calories: { type: Number, required: true },
  steps: { type: [String], required: true },
  ingredients: { type: [], required: true },
  nutrients: { type: [], required: false },
  preferences: { type: [], required: false },
  allergies: { type: [], required: false },
  tags: { type: [String], required: false },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
  shared: { type: Boolean, required: true },
  rating: { type: Number, required: false },
  rates: { type: [], required: false },
  comments: { type: [], required: false },
  originalId: { type: String, required: false },
  isCopy: { type: Boolean, required: false },
  image: { type: String, required: false },
  timestamp: { type: Date, required: false }
});
