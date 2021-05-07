import { mongoose } from "@typegoose/typegoose";
import { User } from "../../../models/User";
import { dbTestConnect } from "../../../tests/utils/db"
import { execGQL } from "../../../tests/utils/graphql";


beforeAll(async () => {
	await dbTestConnect();
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
});

const signUpMutation = `
mutation signUp($user: SignupInput!) {
  signUp(user: $user){
    _id, email, name
  }
}`;

const loginQuery = `
query loginQuery($email: String!, $password: String!){
  login(email: $email, password: $password) {
    token
    user {
      email
    }
  }
}`;

describe("Auth", () => {

	it("can register", async () => {
		let res = await execGQL({
			source: signUpMutation,
			variables: {
				user: { name: "aladdin", email: "aladdin@aladdin.com", password: "password" }
			}
		});

		expect(res).toMatchObject({
			data: {
				signUp: {
					name: "aladdin",
					email: "aladdin@aladdin.com"
				}
			}
		});
		expect(res.data!.signUp._id).toBeDefined();

	});


	it("can login", async () => {
		let res = await execGQL({
			source: loginQuery,
			variables: {
				email: "aladdin@aladdin.com",
				password: "password"
			}
		});

		expect(res.data!.login.user.email).toMatch("aladdin@aladdin.com")
		//valid token
		expect(res.data!.login.token).toBeDefined();
		expect(await User.userFromToken(res.data!.login.token)).toBeTruthy();

	});

});