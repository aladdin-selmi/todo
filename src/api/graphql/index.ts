import { Application } from "express";
const { ApolloServer, gql } = require('apollo-server-express');
import config from "../../config";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { TaskResolver } from "./resolvers/TaskResolver";


/**
 * Create schema from models
 */
async function generateSchema() {
	return await buildTypeDefsAndResolvers({
		resolvers: [TaskResolver]
	});
}

/**
 * Initiate Graphql / Apollo server. And integrate it with express
 */
export async function setupApollo (app: Application) {

	const { typeDefs, resolvers } = await generateSchema();

	const server = new ApolloServer({ typeDefs, resolvers, playground: true, });
	server.applyMiddleware({ app, path: config.graphqlPath });

	return server;
}