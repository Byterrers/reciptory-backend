import * as mongoose from 'mongoose';

export const AllergySchema = new mongoose.Schema({
    name: { type: String, required: true },
});
