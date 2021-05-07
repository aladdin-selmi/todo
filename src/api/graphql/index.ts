import { Application, request, response } from "express";
const { ApolloServer, gql } = require('apollo-server-express');
import config from "../../config";
import { buildTypeDefsAndResolvers, buildSchema } from "type-graphql";
import { TaskResolver } from "./resolvers/TaskResolver";
import { AuthResolver } from "./resolvers/AuthResolver";
import { UserModel } from "../../models/User";


/**
 * Create schema from models
 */
export async function generateSchema() {
	return await buildTypeDefsAndResolvers({
		resolvers: [AuthResolver, TaskResolver]
	});
}

/**
 * Initiate Graphql / Apollo server. And integrate it with express
 */
export async function setupApollo (app: Application) {

	const { typeDefs, resolvers } = await generateSchema();

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }:any) => {

			// Get the user token from the headers.
			if(!req.headers.authorization) return;

			const token = req.headers.authorization.split(" ")[1];
			if(!token) return;
			const userId = await UserModel.userFromToken(token);
			return {userId};
		}
	});
	server.applyMiddleware({ app, path: config.graphqlPath });

	return server;
}