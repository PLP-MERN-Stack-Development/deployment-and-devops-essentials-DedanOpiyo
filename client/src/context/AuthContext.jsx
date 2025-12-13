// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toHome, setToHome] = useState(false);

  // Fetch logged-in user on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getMe();
        console.log("auth me data: ", data)
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setToHome(false);
  };

  const register = async (username, email, password, role) => {
    const data = await authService.register(username, email, password, role);
    setUser(data.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToHome(true);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, toHome, setToHome }}
    >
      {children}
    </AuthContext.Provider>
  );
}
