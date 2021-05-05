import mongoose from "mongoose";
import config from "../config";

export async function dbConnect() {
	if(!config.mongoUrl) throw new Error("Mongo url not found");

	await mongoose.connect(config.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});
}