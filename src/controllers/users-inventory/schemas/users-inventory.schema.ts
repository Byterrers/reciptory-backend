import * as mongoose from 'mongoose';

export const UsersInventorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  refrigerator: { type: [String], required: false },
  freezer: { type: [String], required: false },
  pantry: { type: [String], required: false },
  others: { type: [String], required: false },
});
