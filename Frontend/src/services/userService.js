import API from "./api";

// Admin: User Management
export const getAllUsers = () =>
  API.get("/users");

export const getUsersByRole = (role) =>
  API.get(`/users/role/${role}`);

export const createUser = (data) =>
  API.post("/users", data);

export const updateUser = (id, data) =>
  API.put(`/users/${id}`, data);

export const deleteUser = (id) =>
  API.delete(`/users/${id}`);

// User: Profile Management
export const getUserProfile = () =>
  API.get("/users/profile/me");

export const updateProfile = (data) =>
  API.put("/users/profile/update", data);
