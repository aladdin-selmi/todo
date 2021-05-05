import { Field, ObjectType } from "type-graphql";
import { TaskCreateInput, TaskUpdateInput } from "../api/graphql/inputTypes/TaskInputTypes";
import { Comment } from "./Comment";

// Static data before integrating a database
var tasks = [
	{id: "1", title: 'title 1', content: 'content 1', done: false },
	{id: "2", title: 'title 2', content: 'content 2', done: false },
	{id: "3", title: 'title 3', content: 'content 3', done: true },
	{id: "4", title: 'title 4', content: 'content 4', done: false },
	{id: "5", title: 'title 5', content: 'content 5', done: true },
]

/**
 * Task model. will be synced with Graphql and mongoose schema
 */

@ObjectType({ description: "Task / Todo model" })
export class Task {

	// id can be null before commiting to db.
	@Field({nullable: true})
	id: string;

	@Field()
	title: string;

	@Field()
	content: string;

	@Field()
	done: boolean;

	@Field(() => [Comment], {nullable: true})
	comments?: Comment[] = [];

	constructor(title:string, content: string, done:boolean = false) {
		this.title = title;
		this.content = content;
		this.done = done;
	}


	static async find() {
		return tasks;
	}

	//operations to emulate db
	static async findOne(id: string) {
		return tasks.find((task) => task.id === id);
	}

	static async insert(input: TaskCreateInput) {
		const task = new Task( input.title, input.content );
		tasks.push(task);
		return task;
	}

	static async update(id: string, input: TaskUpdateInput) {
		let task = tasks.find( t => t.id == id) as Task;
		if(!task) return;
		task = Object.assign(task, {...input});
		return task;
	}

	static async markDone(id: string) {
		let task = tasks.find( t => t.id == id) as Task;
		if(!task) return;
		task.done = true;
		return task;
	}

	static async addComment(id: string, content: string) {
		let task = tasks.find( t => t.id == id) as Task;
		if(!task) return;
		if(!task.comments) task.comments = [];
		task.comments.push(new Comment(content));
		return task;
	}

}
