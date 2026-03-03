import API from "./api";

export const createTemple = (data) =>
  API.post("/admin/temples", data);

export const deleteTemple = (id) =>
  API.delete(`/admin/temples/${id}`);

export const updateTemple = (id, data) =>
  API.put(`/admin/temples/${id}`, data);