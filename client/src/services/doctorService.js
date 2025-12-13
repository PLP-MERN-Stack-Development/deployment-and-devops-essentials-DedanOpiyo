// src/services/doctorService.js
import api from "./apiClient";

export default {
  getAll: async () => {
    const res = await api.get("/doctors");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },

  getOne: async (id) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },

  // doctor-only endpoint
  getMine: async () => {
    const res = await api.get("/doctors/profile");
    return res.data;
  },

  // doctor-only endpoint
  updateProfile: async (formData) => {
    const res = await api.put("/doctors/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data;
  },

  // doctor-only endpoint
  async getMyFee() {
    const res = await api.get("/doctors/me/fee");
    return res.data;
  },

  // doctor-only endpoint
  async updateFee(data) {
    const res = await api.put("/doctors/me/fee", data);
    return res.data;
  },
};

