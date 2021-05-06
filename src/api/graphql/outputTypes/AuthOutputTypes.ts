import { Field, ObjectType } from "type-graphql";
import { User } from "../../../models/User";


/**
 * Auth output types needed for graphql
 */
@ObjectType()
export class LoginOutput {
  @Field()
  token: string;

  @Field(() => User)
	user: Partial<User>;

}