import { mongoose, ReturnModelType } from "@typegoose/typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { Document, Model } from "mongoose";
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

		console.log(isOwner, isFriend);

		if(!isOwner && !isFriend) throw new Error("Not authorized");

		return next();
	}
};