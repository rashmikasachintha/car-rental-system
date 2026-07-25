import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT token (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----- Auth -----
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// ----- Cars -----
export const getAllCars = () => api.get("/cars");
export const getAvailableCars = () => api.get("/cars/available");
export const getCarsByCategory = (category) => api.get(`/cars/category/${category}`);
export const getCarById = (id) => api.get(`/cars/${id}`);
export const addCar = (data) => api.post("/cars", data);
export const updateCar = (id, data) => api.put(`/cars/${id}`, data);
export const deleteCar = (id) => api.delete(`/cars/${id}`);

// ----- Bookings -----
export const createBooking = (data) => api.post("/bookings", data);
export const approveBooking = (id) => api.patch(`/bookings/${id}/approve`);
export const rejectBooking = (id) => api.patch(`/bookings/${id}/reject`);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);
export const getBookingsByUser = (userId) => api.get(`/bookings/user/${userId}`);
export const getAllBookings = () => api.get("/bookings");
export const getBookedDatesForCar = (carId) => api.get(`/bookings/car/${carId}/dates`);

export default api;
