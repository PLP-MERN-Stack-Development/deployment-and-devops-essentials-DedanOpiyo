// src/services/paymentService.js
import api from "./apiClient";

export default {
  // Mpesa
  initiateMpesa: (data) => api.post("/payment/stk", data).then((res) => res.data),

  // Paypal
  initiatePayPal: (data) => "/temporary/paypal/url",

  // Payment
  history: () => api.get("/payment/history").then((res) => res.data),
  get: (id) => api.get(`/payment/${id}`).then((res) => res.data),
};
