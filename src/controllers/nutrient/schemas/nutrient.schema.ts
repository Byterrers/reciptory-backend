import * as mongoose from 'mongoose';

export const NutrientSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
