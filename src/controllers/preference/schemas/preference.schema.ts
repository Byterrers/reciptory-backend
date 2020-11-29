import * as mongoose from 'mongoose';

export const PreferenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
