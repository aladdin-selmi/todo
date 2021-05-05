import { getModelForClass, DocumentType, ReturnModelType, modelOptions, prop, defaultClasses, mongoose } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { TaskCreateInput, TaskUpdateInput } from "../api/graphql/inputTypes/TaskInputTypes";
import { Comment } from "./Comment";

/**
 * Task model. will be synced with Graphql and mongoose schema
 */
@ObjectType({ description: "Task / Todo model" })
@modelOptions({ schemaOptions: { timestamps: true} })
export class Task extends defaultClasses.TimeStamps {

	// id can be null before commiting to db.
	@Field({nullable: true})
	id: string;

	@Field()
	@prop({required: true})
	title: string;

	@Field()
	@prop({required: true})
	content: string;

	@Field()
	@prop({required: true, default: false})
	done: boolean = false;

	@Field(() => [Comment], {nullable: true})
	@prop()
	comments?: Comment[] = [];

	static async create(input: TaskCreateInput) : Promise< DocumentType<Task> > {
		let task = new TaskModel({title: input.title, content: input.title});
		await task.save();
		return task;
	}

	static async markDone(_id: string) : Promise< DocumentType<Task> | null > {
		let task = await TaskModel.findOne({_id});
		if(!task) throw new Error("Task not found");
		task.done = true;

		await task.save();
		return task;
	}

	static async addComment(_id: string, content: string) : Promise< DocumentType<Task> > {
		let task = await TaskModel.findOne({_id});
		if(!task) throw new Error("Task not found");
		if(!task.comments) task.comments = [];
		task.comments.push(new Comment(content));
		return await task.save();
	}

}

export const TaskModel = getModelForClass(Task);
