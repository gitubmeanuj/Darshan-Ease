import API from "./api";

export const getTemples = () => API.get("/temples");

export const getTempleById = (id) => API.get(`/temples/${id}`);

export const getSlots = (templeId) =>
  API.get(`/slots/temple/${templeId}`);

export const getAllSlots = () => API.get("/slots");

export const updateSlot = (slotId, data) =>
  API.put(`/slots/${slotId}`, data);

export const deleteSlot = (slotId) =>
  API.delete(`/slots/${slotId}`);