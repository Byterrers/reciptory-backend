import * as mongoose from 'mongoose';

export const UsersTimelineSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  timeline: { type: [], required: true }
});
