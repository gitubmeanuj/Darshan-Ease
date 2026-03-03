import API from "./api";

export const getTemples = () => API.get("/temples");

export const getSlots = (templeId) =>
  API.get(`/temples/${templeId}/slots`);