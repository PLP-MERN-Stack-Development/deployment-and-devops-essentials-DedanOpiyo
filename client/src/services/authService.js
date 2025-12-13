// src/services/authService.js
import api from "./apiClient";

const authService = {
  register: async (username, email, password, role="patient") => {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
      role,
    });
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  // for auto-login when cookie exists
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data.user;
  },
};

export default authService;
