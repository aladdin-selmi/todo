import { defaultClasses, DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { SignupInput } from "../api/graphql/inputTypes/AuthInputTypes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginOutput } from "../api/graphql/outputTypes/AuthOutputTypes";
import config from "../config";


/**
 * User model. will be synced with Graphql and mongoose schema
 */
@ObjectType({ description: "User model" })
export class User extends defaultClasses.TimeStamps {

	@Field()
	@prop()
	name?: string;

	@Field()
	@prop({required: true})
	email: string;

	@prop({required: true})
	password: string;

	static async signUp(input: SignupInput) : Promise< DocumentType<User> > {
		//test user existance
		const foundUser = await UserModel.findOne({email: input.email}, {_id: 1});
		if(foundUser) throw new Error("User already registred");

		// create the new user
		let user = new UserModel({...input});
		user.password = await bcrypt.hash(user.password, 10);
		return await user.save();
	}

	static async login(email: string, password: string) : Promise< LoginOutput > {

		//test user existance
		const user = await UserModel.findOne({email});
		if(!user) throw new Error("User not registered");

		// test password
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) throw new Error("Incorrect password")


		// genetata jwt token
		const token = jwt.sign({userId: user.id}, config.secret, {expiresIn: "1d"});

		await user.save()
		return {token, user};
	}

	static async userFromToken(token: string) : Promise< string > {
		console.log('token ', token);

		try {
			let data = jwt.verify(token, config.secret) as any;
			return data.userId || '';
		} catch (error) {
			return '';
		}
	}

}

export const UserModel = getModelForClass(User);