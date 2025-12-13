// src/services/doctorAppointmentService.js
import api from "./apiClient";

export default {
  // Get appointments for logged-in doctor
  getMine: async () => {
    const res = await api.get("/appointments/doctor");
    return res.data;
  },

  // Confirm appointment
  markConfirmed: async (id) => {
    const res = await api.put(`/appointments/${id}/status`, {
      status: "confirmed",
    });
    return res.data;
  },

  // Mark completed
  markCompleted: async (id) => {
    const res = await api.put(`/appointments/${id}/status`, {
      status: "completed",
    });
    return res.data;
  },

  // Approve patient-proposed fee
  approveFee: async (id) => {
    const res = await api.post(`/appointments/${id}/approve-fee`);
    return res.data;
  },

  // Reject patient-proposed fee
  rejectFee: async (id) => {
    const res = await api.post(`/appointments/${id}/reject-fee`);
    return res.data;
  },
};

// AppointmentService.js has proposeFee (for patients).


// ROUTING ADDITIONS

// In App.jsx:

// <Route
//   path="/me/appointments"
//   element={
//     <ProtectedRoute>
//       <MyAppointments />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/doctor/appointments"
//   element={
//     <ProtectedRoute>
//       <DoctorAppointments />
//     </ProtectedRoute>
//   }
// />
