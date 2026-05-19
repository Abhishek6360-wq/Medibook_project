import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_URL = isLocalhost ? 'http://localhost:4000' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000');

const apiClient = axios.create({
  baseURL: API_URL,
});

// ============= USER API =============
export const registerUserApi = async (userData) => {
  const { data } = await apiClient.post('/api/user/register', userData);
  return data;
};

export const loginUserApi = async (email, password) => {
  const { data } = await apiClient.post('/api/user/login', { email, password });
  return data;
};

export const getProfileApi = async (token) => {
  const { data } = await apiClient.get('/api/user/user-data', {
    headers: { usertoken: token }
  });
  return data;
};

export const updateProfileApi = async (formData, token) => {
  const { data } = await apiClient.post('/api/user/user-update-profile', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data',
      usertoken: token
    }
  });
  return data;
};

// ============= DOCTOR API =============
export const getDoctorsApi = async () => {
  const { data } = await apiClient.get('/api/doctor/list');
  return data;
};

// ============= APPOINTMENT API =============
export const bookAppointmentApi = async (appointmentData, token) => {
  const { data } = await apiClient.post('/api/user/user-appointment', appointmentData, {
    headers: { usertoken: token }
  });
  return data;
};

export const listAppointmentsApi = async (token) => {
  const { data } = await apiClient.get('/api/user/user-appointment-list', {
    headers: { usertoken: token }
  });
  return data;
};

export const cancelAppointmentApi = async (appointmentId, token) => {
  const { data } = await apiClient.post('/api/user/cancel-appointment', { appointmentid: appointmentId }, {
    headers: { usertoken: token }
  });
  return data;
};

export const createPaymentApi = async (appointmentId, token) => {
  const { data } = await apiClient.post('/api/user/payment', { appointmentid: appointmentId }, {
    headers: { usertoken: token }
  });
  return data;
};

export const verifyPaymentApi = async (paymentResponse, token) => {
  const { data } = await apiClient.post('/api/user/verify-payment', { response: paymentResponse }, {
    headers: { usertoken: token }
  });
  return data;
};

// ============= ADMIN/OTHER API =============
export const sendContactApi = async (formData, token) => {
  const { data } = await apiClient.post('/api/admin/contact', formData, {
    headers: { usertoken: token }
  });
  return data;
};

export default apiClient;
