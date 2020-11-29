import * as mongoose from 'mongoose';

export const IngredientSchema = new mongoose.Schema({
    categoryId: { type: String, required: false },
    name: { type: String, required: true },
});
