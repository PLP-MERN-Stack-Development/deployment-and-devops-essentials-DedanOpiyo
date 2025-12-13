// client/services/feePolicyService.js
import api from "./apiClient";

export default {
  getAll: async () => {
    return api.get("/admin/fee-policies").then((res) => res.data);
  },

  create: async (data) => {
    return api.post("/admin/fee-policies", data).then((res) => res.data);
  },

  update: async (id, data) => {
    return api.put(`/admin/fee-policies/${id}`, data).then((res) => res.data);
  },

  remove: async (id) => {
    return api.delete(`/admin/fee-policies/${id}`).then((res) => res.data);
  },
};

// Admin routes
// These are Admin only, doctor can get / update their fee from doctorService.js
// They can approve / dissaprove proposed fee (patient can propose if policy allows - but within range) through doctorAppointmentService.js