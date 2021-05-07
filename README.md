# Todo App
A todo app with authentication, shareable tasks and comments.


### Built with:
 - [Nodejs](https://nodejs.org/) and [TypeScript](https://www.typescriptlang.org/)
 - [Express](https://expressjs.com/)
 - [Graphql](https://graphql.org/) / [Apollo](https://www.apollographql.com/) + [type-graphql](https://typegraphql.com/)
 - [mongoose](https://mongoosejs.com/) + [typegoose](https://github.com/typegoose/typegoose)
 - [Jest](https://jestjs.io/)

---
### Getting started

To run the app using Docker **(Recommended)** . In your terminal execute :
```sh
docker-compose up -d
```

To run the app without Docker. You need a mongodb instance running.
change MONGO_URL in .env file
and then execute :
```sh
npm run dev
```
Apollo playground will be available at http://localhost:4000/graphql.

### **Usage notes:**
- Remember that when you login you get a jwt **token**. You need to provide that token with every request authorization header with this format:
	```
	{ "Authorization": "Bearer <token here>" }
	```

- If you're using docker. remember to stop containers after you finish.
	```sh
	docker-compose down
	```

---
### Tests

To run the tests. In your terminal execute :
```sh
npm test
```
**Note that** only optimat scenario is tested. with critical exceptions.

---
### Featurs

- Authenticate
- List all Tasks
- Get and edit task
- Mark task as done
- Comment on task
- share task with a user

---
### **Notes / Improvements**
- This app in not tested on production.
- More tests are needed.
- Graphql schema docs need to be improved.
- Graphql Response ( error messages and status ) need to be improved.

---
