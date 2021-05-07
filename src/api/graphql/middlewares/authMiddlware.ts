import { mongoose } from "@typegoose/typegoose";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../../../types/context";

/**
 * Check if the user is loggedin
 */
export const isConnected: MiddlewareFn<Context> = ({context}, next) => {
	if(!context.userId) throw new Error("Not authorized");
  return next();
};

/**
 * Check if the user is the owner of the document
 */
export function isOwner(Model: any): MiddlewareFn<Context> {
  return async ({context, args}, next) => {
		let userId = context.userId;

		if(!mongoose.Types.ObjectId.isValid(args.id))
			throw new Error("Not found");

		let doc = await Model.findOne({_id: args.id});
		if(!doc) throw new Error("Not found");

		if(doc.createdBy._id != userId) throw new Error("Not authorized");

		return next();
	}
};

/**
 * Check if the user is the owner of the document
 * Or is listed in sharedWith
 */
export function isOwnerOrFriend(Model: any): MiddlewareFn<Context> {
  return async ({context, args}, next) => {
		let userId = context.userId;

		let doc = await Model.findOne({_id: args.id});
		if(!doc) throw new Error("Not found");

		const isOwner = doc.createdBy._id == userId;
		const isFriend = doc.sharedWith.includes(userId);

		if(!isOwner && !isFriend) throw new Error("Not authorized");

		return next();
	}
};