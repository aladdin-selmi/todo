import { MiddlewareFn } from "type-graphql";
import { Context } from "../../../types/context";

export const isConnected: MiddlewareFn<Context> = ({context}, next) => {
	if(!context.userId) throw new Error("Not authorized");
  return next();
};


export const isOwner: MiddlewareFn<Context> = ({context, args}, next) => {
  if(!context.userId) throw new Error("Not authorized");
  return next();
};