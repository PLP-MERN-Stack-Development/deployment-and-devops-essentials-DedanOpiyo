// src/services/specialtyService.js
import api from "./apiClient";

export default {
  getAll: async () => {
    const res = await api.get("/specialties");
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/specialties", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/specialties/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/specialties/${id}`);
    return res.data;
  },
};

