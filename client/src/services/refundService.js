// src/services/refundService.js
import api from "./apiClient";

export default {
  initiate: (paymentId, reason) =>
    api.post("/refunds/initiate", { paymentId, reason }).then((res) => res.data),
};
