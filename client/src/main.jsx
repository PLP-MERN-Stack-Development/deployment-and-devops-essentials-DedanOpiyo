// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ThemeProvider from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { HelpProvider } from "./context/HelpContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelpProvider>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </HelpProvider>
);
