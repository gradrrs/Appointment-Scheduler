import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export const checkAvailability = async (date) => {
  const response = await axios.get(`${API_BASE}/availability?date=${date}`);
  return response.data;
};

export const getPublicAppointments = async () => {
  const response = await axios.get(`${API_BASE}/appointments`);
  return response.data;
};

export const createAppointment = async (appointment) => {
  const response = await axios.post(`${API_BASE}/appointments`, appointment);
  return response.data;
};

export const getAllAppointments = async () => {
  const response = await axios.get(`${API_BASE}/admin/appointments`);
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await axios.delete(`${API_BASE}/admin/appointments/${id}`);
  return response.data;
};