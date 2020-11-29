import * as mongoose from 'mongoose';

export const TokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
});
