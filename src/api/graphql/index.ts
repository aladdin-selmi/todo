import { Application } from "express";
const { ApolloServer, gql } = require('apollo-server-express');
import config from "../../config";

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

/**
 * Initiate Graphql / Apollo server. And integrate it with express
 */
export function setupApollo (app: Application) {

	const server = new ApolloServer({ typeDefs, resolvers });
	server.applyMiddleware({ app, path: config.graphqlPath });

	return server;
}