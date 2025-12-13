// src/services/locationService.js
import api from "./apiClient";

export default {
  getAll: () => api.get("/locations").then((res) => res.data),
};
