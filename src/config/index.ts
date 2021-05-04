import dotenv from 'dotenv';

// Set the NODE_ENV to 'dev' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const envFound = dotenv.config();

/**
 * This config file helps us validate env variables or have default values
 */
export default {

	// Application port
	port: parseInt(process.env.PORT!) || 3000,

	//Graphql endpoint
	graphqlPath: process.env.GQL_PATH || "/graphql"

}