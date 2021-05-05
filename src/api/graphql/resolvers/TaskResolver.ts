import "reflect-metadata"; // needed for type-graphql
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { DocumentType } from "@typegoose/typegoose";
import { Task, TaskModel } from "../../../models/Task";
import { TaskCreateInput, TaskUpdateInput } from "../inputTypes/TaskInputTypes";

/**
 * Task resolver. Will be shown in graphql
 */
@Resolver()
export class TaskResolver {

	@Query(() => [Task],{ description: "Get all tasks" })
  async tasks() {
    return await TaskModel.find();
	}

	@Query(() => Task,{ description: "Get a single task with id" })
  async task(@Arg("id") id: string) {
    return await TaskModel.findOne({id});
	}

  @Mutation(returns => Task, { description: "Create a task" })
  async createTask(@Arg("task") input: TaskCreateInput): Promise<DocumentType<Task>> {
		return await TaskModel.create(input);
	}

  @Mutation(returns => Task, { description: "Update a task" })
  async updateTask(@Arg("id") id: string, @Arg("task") input: TaskUpdateInput): Promise<Task|null> {
		let upd = await TaskModel.updateOne({_id: id}, {$set : {...input}});
		// TODO: Show proper errors
		return await TaskModel.findOne({_id: id});
	}

  @Mutation(returns => Task, { description: "Mark a task as done" })
  async markTaskDone(@Arg("id") id: string): Promise<DocumentType<Task> | null> {
		return await TaskModel.markDone(id);
	}

  @Mutation(returns => Task, { description: "Comment on task" })
  async addComment(@Arg("id") id: string, @Arg("content") content: string ): Promise<DocumentType<Task>> {
		return await TaskModel.addComment(id, content);
  }

}