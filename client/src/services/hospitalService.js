// src/services/hospitalService.js
import api from "./apiClient";

export default {
  getAll: () => api.get("/hospitals").then((res) => res.data),

  search: (q) =>
    api.get(`/hospitals/search?q=${encodeURIComponent(q)}`)
      .then(res => res.data),

  create: (data) =>
    api.post("/hospitals", data).then((res) => res.data),

  getById: (id) =>
    api.get(`/hospitals/${id}`).then((res) => res.data),

  delete: (id) =>
    api.delete(`/hospitals/${id}`).then((res) => res.data),
};
