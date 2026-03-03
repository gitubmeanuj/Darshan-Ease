import API from "./api";

export const createBooking = (data) =>
  API.post("/bookings", data);

export const getUserBookings = (userId) =>
  API.get(`/bookings/user/${userId}`);

export const cancelBooking = (bookingId) =>
  API.delete(`/bookings/${bookingId}`);