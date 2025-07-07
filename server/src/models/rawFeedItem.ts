import mongoose from "mongoose";

const RawFeedItemSchema = new mongoose.Schema({
  guid: { type: String, required: true, unique: true },
  feedUrl: { type: String, required: true },
  raw: { type: mongoose.Schema.Types.Mixed, required: true }, // ✅ Changed
  fetchedAt: { type: Date, default: Date.now }
});

export const RawFeedItemModel = mongoose.model("RawFeedItem", RawFeedItemSchema);
