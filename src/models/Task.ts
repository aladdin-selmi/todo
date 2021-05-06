import { getModelForClass, DocumentType, ReturnModelType, modelOptions, prop, defaultClasses, mongoose, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { TaskCreateInput, TaskUpdateInput } from "../api/graphql/inputTypes/TaskInputTypes";
import { Comment } from "./Comment";
import { User, UserModel } from "./User";

/**
 * Task model. will be synced with Graphql and mongoose schema
 */
@ObjectType({ description: "Task / Todo model" })
@modelOptions({ schemaOptions: { timestamps: true} })
export class Task extends defaultClasses.TimeStamps {


	@Field()
	_id: string;

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

	@Field(()=> User, {nullable: true})
	@prop({ref: () => UserModel})
	createdBy?: Ref<User>;

	static async create(_id: string, input: TaskCreateInput) : Promise< DocumentType<Task> > {
		let task = new TaskModel({title: input.title, content: input.title, createdBy: _id});
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
		await task.save()
		return task;
	}

	static async userTasks(_id: string) {
		console.log(_id);
		return await TaskModel.find();
	}

}

export const TaskModel = getModelForClass(Task);
