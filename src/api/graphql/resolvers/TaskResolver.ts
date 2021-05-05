import "reflect-metadata"; // needed for type-graphql
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Task } from "../../../models/Task";
import { TaskCreateInput, TaskUpdateInput } from "../inputTypes/TaskInputTypes";

/**
 * Task resolver. Will be shown in graphql
 */
@Resolver()
export class TaskResolver {

	@Query(() => [Task],{ description: "Get all tasks" })
  async tasks() {
    return await Task.find();
	}

	@Query(() => Task,{ description: "Get a single task with id" })
  async task(@Arg("id") id: string) {
    return await Task.findOne(id);
	}

  @Mutation(returns => Task, { description: "Create a task" })
  async createTask(@Arg("task") input: TaskCreateInput): Promise<Task> {
		return await Task.insert(input);
	}

  @Mutation(returns => Task, { description: "Update a task" })
  async updateTask(@Arg("id") id: string, @Arg("task") input: TaskUpdateInput): Promise<Task | undefined> {
		return await Task.update(id, input);
	}

  @Mutation(returns => Task, { description: "Mark a task as done" })
  async markTaskDone(@Arg("id") id: string): Promise<Task | undefined> {
		return await Task.markDone(id);
	}

  @Mutation(returns => Task, { description: "Mark a task as done" })
  async addComment(@Arg("id") id: string, @Arg("content") content: string ): Promise<Task | undefined> {
		return await Task.addComment(id, content);
  }

}