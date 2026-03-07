import API from "./api";

// Temple Services
export const createTemple = (data) =>
  API.post("/temples", data);

export const deleteTemple = (id) =>
  API.delete(`/temples/${id}`);

export const updateTemple = (id, data) =>
  API.put(`/temples/${id}`, data);

// Slot Services
export const createSlot = (data) =>
  API.post("/slots", data);

export const deleteSlot = (id) =>
  API.delete(`/slots/${id}`);

export const updateSlot = (id, data) =>
  API.put(`/slots/${id}`, data);

// User Services (Admin)
export const getAllUsers = () =>
  API.get("/users");

export const getUser = (id) =>
  API.get(`/users/${id}`);

export const updateUser = (id, data) =>
  API.put(`/users/${id}`, data);

export const deleteUser = (id) =>
  API.delete(`/users/${id}`);

// Organizer Services (Admin) - Organizers are users with role "ORGANIZER"
export const getAllOrganizers = () =>
  API.get("/users/role/ORGANIZER");

export const getOrganizer = (id) =>
  API.get(`/users/${id}`);

export const createOrganizer = (data) => {
  const organizerData = { ...data, role: "ORGANIZER" };
  return API.post("/users", organizerData);
};

export const updateOrganizer = (id, data) =>
  API.put(`/users/${id}`, data);

export const assignTempleToOrganizer = (organizerId, templeId) =>
  API.patch(`/users/${organizerId}/assign-temple`, { managedTempleId: templeId || null });

export const deleteOrganizer = (id) =>
  API.delete(`/users/${id}`);