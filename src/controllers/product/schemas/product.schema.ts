import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredient: {type: Object, required: true},
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    expirationDate: { type: String, required: false },
});
