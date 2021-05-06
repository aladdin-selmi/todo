import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { User, UserModel } from "./User";


/**
 * Comment model. will be used in Task model
 */
@ObjectType({ description: "Comment model" })
@modelOptions({ schemaOptions: { timestamps: true} })
export class Comment {

	@Field()
	_id: string;

	@Field()
	@prop({required: true})
	content: string;

	@Field(()=> User)
	@prop({ref: () => UserModel, required: true})
	author: Ref<User>;

}

export const CommentModel = getModelForClass(Comment);