// src/utils/reportKnownIssue.js
import { useNavigate, useLocation } from "react-router-dom";
import useHelp from "../hooks/useHelp";
import { KNOWN_ISSUE_CODES } from "../constants/knownIssues";

/**
 * Usage:
 * 
 * reportKnownIssue({
 *   code: "ADMIN_ONLY_HOSPITAL_CREATION",
 *   data: { attemptedHospital: "St. Mary" }
 * });
 * 
 * OR fallback:
 * 
 * reportKnownIssue({
 *   message: "Unexpected error while creating hospital",
 *   data: {...}
 * });
 */
export function useReportKnownIssue() {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeReturnPoint } = useHelp();

  return ({ code = null, message = null, data = {} }) => {
    let finalMessage = message;
    let finalPart = null;

    // If known code exists, use predefined message
    if (code && KNOWN_ISSUE_CODES[code]) {
      finalMessage = KNOWN_ISSUE_CODES[code].message;
      finalPart = KNOWN_ISSUE_CODES[code].partSlug || null;
    }

    // No message? Use fallback
    if (!finalMessage) {
      finalMessage = "An issue was reported, but no message or code was provided.";
    }

    storeReturnPoint(location.pathname, {
      code,
      message: finalMessage,
      partSlug: finalPart,
      ...data,
    });

    navigate("/help/report");
  };
}
