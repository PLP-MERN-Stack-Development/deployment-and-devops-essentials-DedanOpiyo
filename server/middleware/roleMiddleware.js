// middleware/roleMiddleware.js
exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

// Restrict routes to specific roles (doctor, patient, admin).

// Example usage in routes:
// router.post("/availability", protect, restrictTo("doctor"), addAvailability);
