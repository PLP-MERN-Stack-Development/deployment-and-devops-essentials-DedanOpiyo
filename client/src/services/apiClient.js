// client/src/services/apiClient.js
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL || "http://localhost:5000/api",
  withCredentials: true, // sends httpOnly cookies automatically
});

export default api;
