// src/services/availabilityService.js
import api from "./apiClient";

export default {
  add: async (data) => {
    const res = await api.post("/availability", data);
    return res.data;
  },

  getMine: async () => {
    const res = await api.get("/availability/me");
    return res.data;
  },

  getByDoctor: async (doctorId) => {
    const res = await api.get(`/availability/${doctorId}`);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/availability/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/availability/${id}`);
    return res.data;
  },
};
