import API from "./api";

export const createBooking = (data) =>
  API.post("/bookings", data);

export const getUserBookings = () =>
  API.get("/bookings/my");

export const getAllBookings = () =>
  API.get("/bookings");

export const cancelBooking = (bookingId) =>
  API.delete(`/bookings/${bookingId}`);