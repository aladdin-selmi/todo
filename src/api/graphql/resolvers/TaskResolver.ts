import "reflect-metadata"; // needed for type-graphql
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { DocumentType } from "@typegoose/typegoose";
import { Task, TaskModel } from "../../../models/Task";
import { TaskCreateInput, TaskUpdateInput } from "../inputTypes/TaskInputTypes";
import { isConnected, isOwner } from "../middlewares/authMiddlware";
import { Context } from "../../../types/context";

/**
 * Task resolver. Will be shown in graphql
 */
@Resolver()
export class TaskResolver {

	@Query(() => [Task],{ description: "Get all tasks" })
	@UseMiddleware(isConnected)
  async tasks(@Ctx() ctx:Context) {
    return await TaskModel.userTasks(ctx.userId!);
	}

	@Query(() => Task,{ description: "Get a single task with id" })
	@UseMiddleware(isConnected)
  async task(@Arg("id") id: string) {
    return await TaskModel.findOne({_id: id});
	}

	@Mutation(returns => Task, { description: "Create a task" })
	@UseMiddleware(isConnected)
  async createTask(@Ctx() ctx:Context, @Arg("task") input: TaskCreateInput): Promise<DocumentType<Task>> {
		return await TaskModel.create(ctx.userId!, input);
	}

	@Mutation(returns => Task, { description: "Update a task" })
	@UseMiddleware(isConnected, isOwner(TaskModel))
  async updateTask(@Arg("id") id: string, @Arg("task") input: TaskUpdateInput): Promise<Task|null> {
		let task = await TaskModel.updateOne({_id: id}, {...input});
		task = await TaskModel.findOne({_id: id});
		if(!task) throw new Error("Task not found");
		// TODO: Show proper errors
		return task;
	}

	@Mutation(returns => Task, { description: "Mark a task as done" })
	@UseMiddleware(isConnected, isOwner(TaskModel))
  async markTaskDone(@Arg("id") id: string): Promise<DocumentType<Task> | null> {
		return await TaskModel.markDone(id);
	}

	@Mutation(returns => Task, { description: "Comment on task" })
	@UseMiddleware(isConnected)
  async addComment(@Arg("id") id: string, @Arg("content") content: string ): Promise<DocumentType<Task>> {
		return await TaskModel.addComment(id, content);
  }

}