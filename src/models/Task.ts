import { getModelForClass, DocumentType, ReturnModelType, modelOptions, prop, defaultClasses, mongoose, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { TaskCreateInput, TaskUpdateInput } from "../api/graphql/inputTypes/TaskInputTypes";
import { Comment, CommentModel } from "./Comment";
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

	@Field(()=> [User], {nullable: true})
	@prop({ref: () => UserModel})
	sharedWith?: Ref<User>[] = [];

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

	static async addComment(_id: string, content: string, userId: string) : Promise< DocumentType<Task> > {
		let task = await TaskModel.findOne({_id});
		if(!task) throw new Error("Task not found");
		if(!task.comments) task.comments = []; // just in case
		task.comments.push(new CommentModel({content: content, author: userId}));
		await task.save()
		return task;
	}

	static async tasks(_id: string) {
		return await TaskModel.find({$or: [
			{createdBy: _id}, // the user is the owner
			{sharedWith: [_id]} // the user is listed in sharedWith
		]});
	}

	static async task(_id: string, userId: string) {
		return await TaskModel.findOne({
			_id: _id,
			$or: [
				{createdBy: userId}, // the user is the owner
				{sharedWith: [userId]} // the user is listed in sharedWith
			]
		});
	}

	static async shareWith(_id: string, userId: string) {
		let task = await TaskModel.findOne({_id});
		if(!task) throw new Error("Task not found");
		if(!task.sharedWith) task.sharedWith = [];

		// we should not share with ourselves
		if(task.createdBy == userId) throw new Error("Cannot share with owner");
		// or share with same user multiple times
		if(task.sharedWith.includes(userId)) throw new Error("User already shared with");

		task.sharedWith.push(userId);
		await task.save();
		return task;
	}

}

export const TaskModel = getModelForClass(Task);
