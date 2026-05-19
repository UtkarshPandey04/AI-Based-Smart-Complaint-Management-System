import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");

// Complaint APIs
export const addComplaint = (data) => API.post("/complaints", data);
export const getAllComplaints = (params) => API.get("/complaints", { params });
export const getComplaintById = (id) => API.get(`/complaints/${id}`);
export const updateComplaintStatus = (id, data) => API.put(`/complaints/${id}`, data);
export const deleteComplaint = (id) => API.delete(`/complaints/${id}`);
export const searchByLocation = (location) =>
  API.get("/complaints/search", { params: { location } });

// AI APIs
export const analyzeComplaint = (data) => API.post("/ai/analyze", data);
export const analyzeComplaintById = (id) => API.post(`/ai/analyze/${id}`);

export default API;
