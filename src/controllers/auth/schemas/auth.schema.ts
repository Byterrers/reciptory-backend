import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});
