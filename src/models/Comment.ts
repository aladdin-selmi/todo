import { Field, ObjectType } from "type-graphql";


/**
 * Comment model. will be used in Task model
 */
@ObjectType({ description: "Comment model" })
export class Comment {

	// id can be null before commiting to db.
	@Field({nullable: true})
	id!: string;

	@Field()
	content: string;

	constructor(content: string) {
		this.content = content;
	}

}