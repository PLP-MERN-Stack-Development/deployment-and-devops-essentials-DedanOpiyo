// src/constants/knownIssues.js
export const KNOWN_ISSUE_CODES = {
  ADMIN_ONLY_HOSPITAL_CREATION: {
    message: "Hospital creation is restricted to administrators.",
    partSlug: "doctor-profile", // "hospital", // optional pre-fill partSlug section
  },

  EXPERIENCE_UPDATE_RESTRICTED: {
    message: "Updating work experience triggered a restricted route error.",
    partSlug: "experience",
  },

  MAP_LOCATION_INVALID: {
    message: "Map location data was invalid or incomplete.",
  },

  API_UNAUTHORIZED: {
    message: "Unauthorized API call detected.",
  },

  API_UNEXPECTED_ERROR: {
    message: "An unexpected API error occurred.",
  },

  VALIDATION_FAILURE: {
    message: "A required validation rule failed.",
  }
};

// Why this is good:

// Admin sees a standardized, clean message

// Issues get categorized consistently

// You can add codes anytime without changing helper logic

// src/utils/reportKnownIssue.js: (helper now supports both code & custom message)
