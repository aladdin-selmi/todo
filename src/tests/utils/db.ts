import mongoose from "mongoose";
import config from "../../config";

export async function dbTestConnect() {
	if(!config.mongoUrl) throw new Error("Mongo url not found");

	const url = config.mongoUrl + "--test";

	await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
	await mongoose.connection.db.dropDatabase();
}

export async function insertTestUsers() {
	await mongoose.connection.collection('users').insertMany([
		{
			"_id" : "60949bc9f1e0c37de141bcfa",
			"name" : "aladdin@email.com",
			"email" : "aladdin@aladdin.com",
			"password" : "$2a$10$qWu/SS/vanYufLftyli.AO2XkyFpDUcY1BUHD/bGxNEV/0PM.PVnW", // 'password'
			"createdAt" : "2021-05-06T05:33:45.033Z",
			"updatedAt" : "2021-05-06T05:33:45.033Z",
			"__v" : 0
		},
		{
			"_id" : "6094a55c1c01ae7b94671fd1",
			"email" : "bob@email.com",
			"password" : "$2a$10$2yJ48YYveCMzDDMIGgRlNemXBIRud43fotvXhmQIMhES2nyNXSwUe",
			"createdAt" : "2021-05-07T02:26:36.985Z",
			"updatedAt" : "2021-05-07T02:26:36.985Z",
			"__v" : 0
		}
	]);
}