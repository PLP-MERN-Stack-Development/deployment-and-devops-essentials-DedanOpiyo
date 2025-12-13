// src/services/notificationService.js
import api from "./apiClient";

export default {
  getAll: () => api.get("/notifications").then((res) => res.data),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAll: () => api.patch("/notifications/read-all"),
};
