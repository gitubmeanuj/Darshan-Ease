import API from "./api";

export const getTemples = () => API.get("/temples");

export const getTempleById = (id) => API.get(`/temples/${id}`);

export const getOrganizerTemple = () => API.get("/temples/organizer/my-temple");

export const createTemple = (data) => API.post("/temples", data);

export const updateTemple = (id, data) =>
  API.put(`/temples/${id}`, data);

export const deleteTemple = (id) =>
  API.delete(`/temples/${id}`);

export const getSlots = (templeId) =>
  API.get(`/slots/temple/${templeId}`);

export const getAllSlots = () => API.get("/slots");

export const getOrganizerSlots = () => API.get("/slots/organizer/my-slots");

export const createSlot = (data) => API.post("/slots", data);

export const updateSlot = (slotId, data) =>
  API.put(`/slots/${slotId}`, data);

export const deleteSlot = (slotId) =>
  API.delete(`/slots/${slotId}`);