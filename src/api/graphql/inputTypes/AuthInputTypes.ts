import { Field, InputType } from "type-graphql";
import { User } from "../../../models/User";


/**
 * Auth input types needed for graphql
 */
@InputType()
export class SignupInput implements Pick<User, "name" | "email" | "password"> {

	@Field({nullable: true})
	name: string;

	@Field()
  email: string;

  @Field()
	password: string;

}


@InputType()
export class LoginInput implements Pick<User, "email" | "password"> {

	@Field()
  email: string;

  @Field()
	password: string;

}