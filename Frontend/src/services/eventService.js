import API from "./api";

export const createEvent = (data) =>
  API.post("/events", data);

export const getAllEvents = () =>
  API.get("/events");

export const getEventsByTemple = (templeId) =>
  API.get(`/events/temple/${templeId}`);

export const updateEvent = (id, data) =>
  API.put(`/events/${id}`, data);

export const deleteEvent = (id) =>
  API.delete(`/events/${id}`);
