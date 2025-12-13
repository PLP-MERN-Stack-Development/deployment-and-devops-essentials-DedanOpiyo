// src/services/paymentService.js
import api from "./apiClient";

export default {
  // Mpesa
  initiateMpesa: (data) => api.post("/payments/stk", data).then((res) => res.data),

  // Paypal
  initiatePayPal: (data) => "/temporary/paypal/url",

  // Payment
  history: () => api.get("/payments/history").then((res) => res.data),
  get: (id) => api.get(`/payments/${id}`).then((res) => res.data),
};
