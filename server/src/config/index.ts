import mongoose from "mongoose";
import "dotenv/config"; // loads .env once here

export const connectMongo = async () => {
	const uri = process.env.MONGO_URI as string;
	if (!uri) throw new Error("MONGO_URI missing in env");

	// strictQuery false quietens deprecation notice
	mongoose.set("strictQuery", false);

	await mongoose.connect(uri);
	console.log("[mongo] Connected");
};
