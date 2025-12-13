// src/services/reviewService.js
import api from "./apiClient";

export default {
  add: (data) => api.post("/reviews", data).then(res => res.data),
  getDoctorReviews: (doctorId) =>
    api.get(`/reviews/doctor/${doctorId}`).then(res => res.data),
};
