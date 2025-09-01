
import { userSchema } from "./validator.ts";
import { parse } from "https://deno.land/x/valibot@v0.25.0/mod.ts";
import type { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService
} from "./service.ts";


export const getAllUsers = (ctx: RouterContext<"/users">) => {
  ctx.response.body = { users: getAllUsersService() };
};


export const getUserById = (ctx: RouterContext<"/users/:id">) => {
  const id = parseInt(ctx.params.id);
  const user = getUserByIdService(id);
  if (user) {
    ctx.response.body = { user };
  } else {
    ctx.response.status = 404;
    ctx.response.body = { error: "User not found" };
  }
};


export const createUser = async (ctx: RouterContext<"/users">) => {
  try {
    const body = await ctx.request.body({ type: "json" }).value;
    const result = parse(userSchema, body);
    const newUser = createUserService(result);
    ctx.response.status = 201;
    ctx.response.body = { user: newUser };
  } catch (error: unknown) {
    ctx.response.status = 400;
    if (typeof error === "object" && error !== null && "message" in (error as Record<string, unknown>) && typeof (error as Record<string, unknown>).message === "string") {
      ctx.response.body = { error: (error as Record<string, unknown>).message };
    } else {
      ctx.response.body = { error: "Invalid data" };
    }
  }
};


export const updateUser = async (ctx: RouterContext<"/users/:id">) => {
  const id = parseInt(ctx.params.id);
  try {
    const body = await ctx.request.body({ type: "json" }).value;
    const result = parse(userSchema, body);
    const updatedUser = updateUserService(id, result);
    if (!updatedUser) {
      ctx.response.status = 404;
      ctx.response.body = { error: "User not found" };
      return;
    }
    ctx.response.body = { user: updatedUser };
  } catch (error: unknown) {
    ctx.response.status = 400;
    if (typeof error === "object" && error !== null && "message" in (error as Record<string, unknown>) && typeof (error as Record<string, unknown>).message === "string") {
      ctx.response.body = { error: (error as Record<string, unknown>).message };
    } else {
      ctx.response.body = { error: "Invalid data" };
    }
  }
};


export const deleteUser = (ctx: RouterContext<"/users/:id">) => {
  const id = parseInt(ctx.params.id);
  const deleted = deleteUserService(id);
  if (!deleted) {
    ctx.response.status = 404;
    ctx.response.body = { error: "User not found" };
    return;
  }
  ctx.response.status = 204;
};
