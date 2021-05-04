import express, { Application, Request, Response } from "express";
import config from "./config";
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });


const app: Application = express();
server.applyMiddleware({ app, path: config.graphqlPath });

app.get('/', (req: Request, res: Response) => {
	res.send("hello");
});

app.listen(config.port, () => {
	console.log(`Server listening on http://localhost:${config.port}${server.graphqlPath}`);
})