import { makeExecutableSchema } from "apollo-server-express";
import { graphql, GraphQLSchema } from "graphql"
import { generateSchema } from "../../api/graphql";


let schema: GraphQLSchema ;

export const execGQL = async ({source, variables, userId=''}: any) => {
	if(!schema) {
		const { typeDefs, resolvers } = await generateSchema();
		schema = makeExecutableSchema({ typeDefs, resolvers });
	};

	return graphql({
		schema: schema,
		source: source,
		variableValues: variables,
		contextValue: {
			userId: userId
		}
	});

}