import mongoose from "mongoose";

const ImportLogSchema = new mongoose.Schema(
  {
    sourceUrls:  [String],   // all feeds hit in this run
    startedAt:   Date,
    finishedAt:  Date,

    totalFetched:Number,
    newJobs:     Number,

    failedFeeds: [String]    // URLs that threw an error
  },
  { timestamps: true }
);

export default mongoose.model("ImportLog", ImportLogSchema);
