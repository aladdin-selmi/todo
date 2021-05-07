import { DocumentType, mongoose } from "@typegoose/typegoose";
import { Task, TaskModel } from "../../../models/Task";
import { dbTestConnect, insertTestUsers } from "../../../tests/utils/db"
import { execGQL } from "../../../tests/utils/graphql";

beforeAll(async () => {
	await dbTestConnect();
	await insertTestUsers();
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
});

const createTaskMutation = `
mutation ($task: TaskCreateInput!){
  createTask(task: $task) {
    _id
    title
    done,
    createdBy{_id}
    comments {
      content
    }
  }
}`;

const getTaskQuery = `
query task($id: String!){
  task(id: $id) {
    _id
		title,
		createdBy {_id}
    comments{_id, content, author{_id}}
  }
}`;

const addCommentMutation = `
mutation addComment ($id: String!, $content: String!) {
  addComment(id: $id, content: $content) {
    _id
    comments {
      _id
      content
      author {_id, name}
    }
  }
}`;

const shareMutation = `
mutation shareWith($taskId: String!, $userId: String!) {
  shareWith(taskId: $taskId, userId: $userId) {
    _id
    title,
    sharedWith{_id}
  }
}`;

const markDoneMutation = `
mutation markTaskDone($id: String!) {
  markTaskDone( id: $id ) {
    _id,done
  }
}`;


describe("Task operations", () => {

	let task: DocumentType<Task> | null;

	it("can't create task if not connected", async () => {
		let res = await execGQL({
			source: createTaskMutation,
			variables: {
				task: { title: "test title", content: "test content" }
			}
		});

		expect(res.data).toBeFalsy();
		expect(res.errors).toBeDefined();

	});


	it("can create task", async () => {
		let res = await execGQL({
			source: createTaskMutation,
			variables: {
				task: { title: "test title", content: "test content" }
			},
			userId: '60949bc9f1e0c37de141bcfa' // user aladdin
		});

		expect(res.errors).toBeFalsy();
		expect(res.data).toBeDefined();

		expect(res.data).toMatchObject({
			createTask: {
        title: 'test title',
        done: false,
        createdBy: { _id: '60949bc9f1e0c37de141bcfa' },
        comments: []
      }
		});

		expect(res.data!.createTask._id).toBeDefined();
		task = await TaskModel.findOne({_id: res.data!.createTask._id});

		expect(task!._id).toBeDefined();

	});

	//-----------------------------

	it("can' get task if not connected", async () => {
		let res = await execGQL({
			source: addCommentMutation,
			variables: {
				id: task!._id.toString()
			},
		});

		expect(res.data).toBeFalsy();
		expect(res.errors).toBeDefined();

	});

	it("can get task", async () => {
		let res = await execGQL({
			source: getTaskQuery,
			variables: {
				id: task!._id.toString()
			},
			userId: '60949bc9f1e0c37de141bcfa' // user aladdin
		});

		expect(res.errors).toBeFalsy();
		expect(res.data).toBeDefined();

		expect(res.data!.task.createdBy._id).toBe("60949bc9f1e0c37de141bcfa");

	});

	it("can add comment if owner", async () => {
		let res = await execGQL({
			source: addCommentMutation,
			variables: {
				id: task!._id.toString(),
				content: 'test comment from owner'
			},
			userId: '60949bc9f1e0c37de141bcfa' // user aladdin
		});

		expect(res.errors).toBeFalsy();
		expect(res.data).toBeDefined();
		let data = res.data!.addComment;
		expect(data.comments.length).toBe(1);
		let com = data.comments[0];
		expect(com._id).toBeDefined();
		expect(com.content).toBe("test comment from owner");
		expect(com.author._id).toBe("60949bc9f1e0c37de141bcfa");

	});

	it("can't add comment if not owner", async () => {
		let res = await execGQL({
			source: addCommentMutation,
			variables: {
				id: task!._id.toString(),
				content: 'test comment from owner'
			},
			userId: '6094a55c1c01ae7b94671fd1' // user bob
		});

		expect(res.data).toBeFalsy();
		expect(res.errors).toBeDefined();

	});

	it("can share task", async () => {
		let res = await execGQL({
			source: shareMutation,
			variables: {
				taskId: task!._id.toString(),
				userId: '6094a55c1c01ae7b94671fd1' // user bob
			},
			userId: '60949bc9f1e0c37de141bcfa' // user aladdin
		});

		expect(res.errors).toBeFalsy();
		expect(res.data).toBeDefined();

		let data = res.data!.shareWith;
		expect(data.sharedWith.length).toBe(1);
		expect(data.sharedWith[0]).toMatchObject({
			_id: "6094a55c1c01ae7b94671fd1"
		})

	});

	it("can't share task with same user multiple times", async () => {
		let res = await execGQL({
			source: shareMutation,
			variables: {
				taskId: task!._id.toString(),
				userId: '6094a55c1c01ae7b94671fd1' // user bob
			},
			userId: '60949bc9f1e0c37de141bcfa' // user aladdin
		});

		expect(res.data).toBeFalsy();
		expect(res.errors).toBeDefined();

	});

	it("can't share task with owner", async () => {
		let res = await execGQL({
			source: shareMutation,
			variables: {
				taskId: task!._id.toString(),
				userId: '60949bc9f1e0c37de141bcfa' // user aladdin
			},
			userId: '60949bc9f1e0c37de141bcfa' // user aladdin
		});

		expect(res.data).toBeFalsy();
		expect(res.errors).toBeDefined();

	});


	it("can comment if shared with", async () => {
		let res = await execGQL({
			source: addCommentMutation,
			variables: {
				id: task!._id.toString(),
				content: 'test comment from friend'
			},
			userId: '6094a55c1c01ae7b94671fd1' // user bob
		});

		expect(res.errors).toBeFalsy();
		expect(res.data).toBeDefined();
		let data = res.data!.addComment;
		expect(data.comments.length).toBe(2);
		let com = data.comments[1];
		expect(com._id).toBeDefined();
		expect(com.content).toBe("test comment from friend");
		expect(com.author._id).toBe("6094a55c1c01ae7b94671fd1");

	});

	it("can mark task as done", async () => {
		let res = await execGQL({
			source: markDoneMutation,
			variables: {
				id: task!._id.toString()
			},
			userId: '60949bc9f1e0c37de141bcfa' // user aladdin
		});

		expect(res.errors).toBeFalsy();
		expect(res.data).toBeDefined();

		let data = res.data!.markTaskDone;
		expect(data.done).toBe(true);

	});

});