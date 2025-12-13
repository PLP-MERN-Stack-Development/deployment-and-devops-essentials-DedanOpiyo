// src/services/experienceService.js
import api from "./apiClient";

export default {
  add: (data) =>
    api.post("/experience", data).then((res) => res.data),

  getDoctorExperience: (id) =>
    api.get(`/experience/${id}`).then((res) => res.data),

  update: (id, data) =>
    api.put(`/experience/${id}`, data).then((res) => res.data),

  delete: (id) =>
    api.delete(`/experience/${id}`).then((res) => res.data),
};
