import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api/bookings';

export const createBooking = async (bookingData) => {
  const response = await axios.post(API_BASE_URL, bookingData);
  return response.data;
};

export const getUserBookings = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/my/${userId}`);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const approveBooking = async (id, reason) => {
  const response = await axios.patch(`${API_BASE_URL}/${id}/approve`, { reason });
  return response.data;
};

export const rejectBooking = async (id, reason) => {
  const response = await axios.patch(`${API_BASE_URL}/${id}/reject`, { reason });
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await axios.patch(`${API_BASE_URL}/${id}/cancel`);
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
