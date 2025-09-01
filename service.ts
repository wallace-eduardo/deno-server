// service.ts

const users: Array<{ id: number; name: string; email: string }> = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

export function getAllUsersService() {
  return users;
}

export function getUserByIdService(id: number) {
  return users.find(u => u.id === id);
}

export function createUserService(data: { name: string; email: string }) {
  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    ...data
  };
  users.push(newUser);
  return newUser;
}

export function updateUserService(id: number, data: { name: string; email: string }) {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return null;
  users[userIndex] = { ...users[userIndex], ...data };
  return users[userIndex];
}

export function deleteUserService(id: number) {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return false;
  users.splice(userIndex, 1);
  return true;
}
