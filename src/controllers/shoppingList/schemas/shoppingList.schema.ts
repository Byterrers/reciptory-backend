import * as mongoose from 'mongoose';

export const ShoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: { type: [String], required: true },
  userId: { type: String, required: true },
});
