import { Field, InputType } from "type-graphql";
import { Task } from "../../../models/Task";

/**
 * Task input types needed for graphql
 */
@InputType()
export class TaskCreateInput implements Pick<Task, "title" | "content"> {
  @Field()
  title: string;

  @Field()
	content: string;

}

@InputType()
export class TaskUpdateInput implements Partial<Task> {

	@Field({nullable: true})
  title?: string;

  @Field({nullable: true})
	content?: string;

	@Field({nullable: true})
	done?: boolean;
}