import { Schema, model } from "mongoose";

const RawFeedSchema = new Schema(
	{
		guid: { type: String, required: true, unique: true },
		sourceUrl: String,
		payload: Schema.Types.Mixed, // entire XML‑to‑JSON object
	},
	{ timestamps: true }
);

export default model("RawFeed", RawFeedSchema);
// This model represents a raw feed item in the database.
// It includes fields for the item's unique identifier (guid), the source URL,