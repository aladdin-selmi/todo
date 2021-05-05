import express, { Application, Request, Response } from "express";
import config from "./config";
import { setupApollo } from "./api/graphql";

const app: Application = express(); // init express app

// server root endpoint. Just for testing
app.get('/', (req: Request, res: Response) => {
	res.send("hello");
});


setupApollo(app) // init gql server. And wait for it
	.then((apolloServer) => {

		// start express server
		app.listen(config.port, () => {
			console.log(`\n\nServer listening on http://localhost:${config.port}${apolloServer.graphqlPath}\n\n`);
		})

	})
