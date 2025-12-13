// src/services/adminService.js
import api from "./apiClient";

export default {
  getStats: () => api.get("/admin/stats").then(res => res.data),

  // USERS
  getUsers: () => api.get("/admin/users").then(res => res.data),
  toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`).then(res => res.data),

  // BLOGS
  getBlogs: () => api.get("/admin/blogs").then(res => res.data),
  deleteBlog: (id) => api.delete(`/admin/blogs/${id}`).then(res => res.data),

  // DOCTORS
  getDoctors: () => api.get("/admin/doctors").then(res => res.data),
  promote: (data) => api.post("/admin/doctors/promote", data).then(res => res.data),
  updateDoctor: (id, data) =>
    api.put(`/admin/doctors/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then(res => res.data),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`).then(res => res.data),
};
