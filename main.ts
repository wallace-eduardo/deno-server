import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();
const app = new Application();

// In-memory data store (no persistent storage)
let users: Array<{ id: number; name: string; email: string }> = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

// Middleware for JSON parsing and CORS
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 200;
    return;
  }
  
  await next();
});

// Routes
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
  .get("/users", (ctx) => {
    ctx.response.body = { users };
  })
  .get("/users/:id", (ctx) => {
    const id = parseInt(ctx.params.id);
    const user = users.find(u => u.id === id);
    
    if (user) {
      ctx.response.body = { user };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { error: "User not found" };
    }
  })
  .post("/users", async (ctx) => {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        name: body.name,
        email: body.email
      };
      
      users.push(newUser);
      ctx.response.status = 201;
      ctx.response.body = { user: newUser };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid JSON" };
    }
  })
  .put("/users/:id", async (ctx) => {
    const id = parseInt(ctx.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      ctx.response.status = 404;
      ctx.response.body = { error: "User not found" };
      return;
    }
    
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      users[userIndex] = { ...users[userIndex], ...body };
      ctx.response.body = { user: users[userIndex] };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid JSON" };
    }
  })
  .delete("/users/:id", (ctx) => {
    const id = parseInt(ctx.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      ctx.response.status = 404;
      ctx.response.body = { error: "User not found" };
      return;
    }
    
    users.splice(userIndex, 1);
    ctx.response.status = 204;
  });

app.use(router.routes());
app.use(router.allowedMethods());

// Error handling
app.addEventListener("error", (evt) => {
  console.error("Server error:", evt.error);
});

const PORT = 8000;

console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });