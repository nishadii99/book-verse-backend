// src/models/history.model.ts
import mongoose from "mongoose";

export interface IHistory extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  books: string[]; // book titles
  createdAt?: Date;
  updatedAt?: Date;
}

const HistorySchema = new mongoose.Schema<IHistory>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    books: [String],
  },
  { timestamps: true }
);

export const History = mongoose.model<IHistory>("History", HistorySchema);
