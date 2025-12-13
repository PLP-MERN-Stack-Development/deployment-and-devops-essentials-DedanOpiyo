// src/context/HelpContext.jsx
import { createContext, useState, useEffect } from "react";

export const HelpContext = createContext();

export function HelpProvider({ children }) {
  const [returnInfo, setReturnInfo] = useState(null);

  // load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("helpReturn");
    if (saved) {
      setReturnInfo(JSON.parse(saved));
    }
  }, []);

  const storeReturnPoint = (path, data = null) => {
    const info = { path, data };
    setReturnInfo(info);
    localStorage.setItem("helpReturn", JSON.stringify(info));
  };

  // Utility method (rarely needed (e.g., a static utility function that cannot access hooks) - outside React context)
  const loadReturnPoint = () => {
    const saved = JSON.parse(localStorage.getItem("helpReturn"));
    return saved || { path: "/", data: null };
  };

  const clearReturnPoint = () => {
    setReturnInfo(null);
    localStorage.removeItem("helpReturn");
  };

  return (
    <HelpContext.Provider value={{ returnInfo, storeReturnPoint, loadReturnPoint, clearReturnPoint }}>
      {children}
    </HelpContext.Provider>
  );
}
