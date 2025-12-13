// src/services/helpService.js
import api from "./apiClient";

export default {
  getParts: () => api.get("/help/parts/list").then(res => res.data),

  getPartBySlug: (slug) =>
  api.get(`/help/parts/slug/${slug}`).then(res => res.data),

  createIssue: (formData) =>
    api.post("/help", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => res.data),

  getIssues: () =>
    api.get("/help").then(res => res.data),

  updateStatus: (id, status) =>
    api.put(`/help/${id}/status`, { status }).then(res => res.data),

  createPart: (data) =>
    api.post("/help/parts", data).then(res => res.data),
};
