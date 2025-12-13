// src/hooks/useHelp.js
import { useContext } from "react";
import { HelpContext } from "../context/HelpContext";

export default function useHelp() {
  return useContext(HelpContext);
}

// Usage:

// const { storeReturnPoint, returnInfo, clearReturnPoint } = useHelp();