import express, { Application, Request, Response } from "express";
import config from "./config";
import { setupApollo } from "./api/graphql";

const app: Application = express(); // init express app
const apolloServer = setupApollo(app); // init gql server

// server root endpoint.
app.get('/', (req: Request, res: Response) => {
	res.send("hello");
});

// 404 page
app.get('*', function(req: Request, res: Response){
  res.status(404).send('Not Found');
});

// start server
app.listen(config.port, () => {
	console.log(`Server listening on http://localhost:${config.port}${apolloServer.graphqlPath}`);
})