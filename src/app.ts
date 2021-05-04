import express, { Application, Request, Response } from "express";

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
	res.send("hello");
});

app.listen(3000, () => {
	console.log(`Server listening on http://localhost:3000`);
})