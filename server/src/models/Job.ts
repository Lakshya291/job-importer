import { Schema, model } from "mongoose";

const JobSchema = new Schema(
	{
		guid: { type: String, required: true, unique: true, index: true },
		title: String,
		link: String,
		description: String,
		company: String,
		publishedAt: Date,
		raw: Schema.Types.Mixed, // store full original item
	},
	{ timestamps: true }
);

export default model("Job", JobSchema);
// This model represents a job posting in the database.
// It includes fields for the job's unique identifier (guid), title, link, description,
