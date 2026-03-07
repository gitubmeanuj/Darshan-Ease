import API from "./api";

export const createTemple = (data) =>
  API.post("/temples", data);

export const deleteTemple = (id) =>
  API.delete(`/temples/${id}`);

export const updateTemple = (id, data) =>
  API.put(`/temples/${id}`, data);

export const createSlot = (data) =>
  API.post("/slots", data);

export const deleteSlot = (id) =>
  API.delete(`/slots/${id}`);

export const updateSlot = (id, data) =>
  API.put(`/slots/${id}`, data);