import express, { Application, Request, Response } from "express";
import config from "./config";
import { setupApollo } from "./api/graphql";
import { dbConnect } from "./utils/db";

const app: Application = express(); // init express app

// server root endpoint. Just for testing
app.get('/', (req: Request, res: Response) => {
	res.send("hello");
});

async function startServer() {

	await dbConnect(); // init db connection. And wait for it
	const apolloServer = await setupApollo(app); // init gql server. And wait for it

	// start express server
	app.listen(config.port, () => {
		console.log(`\n\nServer listening on http://localhost:${config.port}${apolloServer.graphqlPath}\n\n`);
	})

}

startServer();
