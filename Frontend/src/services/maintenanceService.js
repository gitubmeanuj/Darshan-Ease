import API from "./api";

export const createMaintenance = (data) =>
  API.post("/maintenance", data);

export const getAllMaintenance = () =>
  API.get("/maintenance");

export const getMaintenanceByTemple = (templeId) =>
  API.get(`/maintenance/temple/${templeId}`);

export const updateMaintenanceStatus = (id, data) =>
  API.put(`/maintenance/${id}`, data);

export const deleteMaintenance = (id) =>
  API.delete(`/maintenance/${id}`);
