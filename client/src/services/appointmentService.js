// src/services/appointmentService.js
import api from "./apiClient";

export default {
  // Create appointment (supports patient requested fee)
  book: async (data) => {
    // data may include: doctor, date, requestedFee
    const res = await api.post("/appointments", data);
    return res.data;
  },

  // Patient's own appointments
  myAppointments: async () => {
    const res = await api.get("/appointments/me");
    return res.data;
  },

  // Doctor's appointments (fallback, but doctor service should be used)
  doctorAppointments: async () => {
    const res = await api.get("/appointments/doctor");
    return res.data;
  },

  // Leave a review
  review: async (id, rating, comment) => {
    const res = await api.post(`/appointments/${id}/review`, {
      rating,
      comment,
    });
    return res.data;
  },

  // Cancel appointment
  cancel: async (id) => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  },

  // Patient only: propose fee
  proposeFee: async (id) => {
    const res = await api.post(`/appointments/${id}/propose-fee`);
    return res.data;
  },
};

// Note: appointMentController also allows approve / reject patient's proposed fee
// doctorAppointmentService.js includes the two endpoints