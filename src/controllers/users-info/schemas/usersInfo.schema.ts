import * as mongoose from 'mongoose';

export const UsersInfoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  name: { type: String, required: false },
  gender: { type: String, required: false },
  country: { type: String, required: false },
  city: { type: String, required: false },
  avatar: { type: String, required: false },
  preferences: { type: [], required: false },
  allergies: { type: [], required: false },
  userShoppingLists: { type: [], required: false },
  following: { type: [String], required: false },
  followers: { type: [String], required: false },
});
