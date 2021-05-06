import { DocumentType } from "@typegoose/typegoose";
import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { User, UserModel } from "../../../models/User";
import { SignupInput } from "../inputTypes/AuthInputTypes";
import { LoginOutput } from "../outputTypes/AuthOutputTypes";

/**
 * Auth resolver. Will be shown in graphql
 */
@Resolver()
export class AuthResolver {

	@Mutation(() => User, { description: "Sign up" })
  async signUp(@Arg("user") input: SignupInput): Promise<Promise<DocumentType<User>>> {
		return await UserModel.signUp(input);
	}

	@Query(() => LoginOutput,{ description: "Log in" })
  async login(@Arg("email") email: string, @Arg("password") password: string): Promise<LoginOutput> {
		return await UserModel.login(email, password);

	}
}