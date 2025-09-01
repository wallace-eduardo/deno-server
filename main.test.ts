import { assertEquals, assertExists } from "https://deno.land/std@0.200.0/assert/mod.ts";

const BASE_URL = "http://localhost:8000";

Deno.test("GET /users - should return all users", async () => {
  const response = await fetch(`${BASE_URL}/users`);
  const data = await response.json();
  
  assertEquals(response.status, 200);
  assertExists(data.users);
  assertEquals(Array.isArray(data.users), true);
});

Deno.test("GET /users/:id - should return specific user", async () => {
  const response = await fetch(`${BASE_URL}/users/1`);
  const data = await response.json();
  
  assertEquals(response.status, 200);
  assertExists(data.user);
  assertEquals(data.user.id, 1);
});

Deno.test("GET /users/:id - should return 404 for non-existent user", async () => {
  const response = await fetch(`${BASE_URL}/users/999`);
  const data = await response.json();
  
  assertEquals(response.status, 404);
  assertEquals(data.error, "User not found");
});

Deno.test("POST /users - should create new user", async () => {
  const newUser = {
    name: "Test User",
    email: "test@example.com"
  };
  
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
  });
  
  const data = await response.json();
  
  assertEquals(response.status, 201);
  assertExists(data.user);
  assertEquals(data.user.name, newUser.name);
  assertEquals(data.user.email, newUser.email);
  assertExists(data.user.id);
});

Deno.test("PUT /users/:id - should update existing user", async () => {
  const updatedData = {
    name: "Updated Name",
    email: "updated@example.com"
  };

  const response = await fetch(`${BASE_URL}/users/1`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedData)
  });

  const data = await response.json();

  assertEquals(response.status, 200);
  assertEquals(data.user.name, updatedData.name);
  assertEquals(data.user.email, updatedData.email);
  assertEquals(data.user.id, 1);
});

Deno.test("DELETE /users/:id - should delete user", async () => {
  // First create a user to delete
  const newUser = {
    name: "To Delete",
    email: "delete@example.com"
  };
  
  const createResponse = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
  });
  
  const createdUser = await createResponse.json();
  // Do not call .cancel() after .json() (stream is locked)
  const userId = createdUser.user.id;
  
  // Now delete the user
  const deleteResponse = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE"
  });
  // Only cancel if body is not locked
  if (deleteResponse.body && !deleteResponse.body.locked) {
    await deleteResponse.body.cancel();
  }
  
  assertEquals(deleteResponse.status, 204);
  
  // Verify user is deleted
  const getResponse = await fetch(`${BASE_URL}/users/${userId}`);
  if (getResponse.body && !getResponse.body.locked) {
    await getResponse.body.cancel();
  }
  assertEquals(getResponse.status, 404);
});