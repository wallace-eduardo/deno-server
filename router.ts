import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "./controller.ts";

const router = new Router();

router
  .get("/", (ctx) => {
    ctx.response.body = {
      endpoints: [
        "GET /users - Get all users",
        "GET /users/:id - Get user by ID",
        "POST /users - Create new user",
        "PUT /users/:id - Update user",
        "DELETE /users/:id - Delete user"
      ]
    };
  })
  .get("/users", getAllUsers)
  .get("/users/:id", getUserById)
  .post("/users", createUser)
  .put("/users/:id", updateUser)
  .delete("/users/:id", deleteUser);

export default router;
