// client/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role))
    if (allowedRoles.length === 1) {
      alert(`Only ${allowedRoles[0]}s can access this page!`); // "admin"
      return <Navigate to="/" replace />;
    }

    else if (allowedRoles.length === 2) {
      alert(`Only ${allowedRoles.join(" and ")}s can access this page!`); // "admin and doctor"
      return <Navigate to="/" replace />;
    }
    
    // 3+ roles → Oxford comma list
    else {
      alert(`Only ${allowedRoles.slice(0, -1).join(", ") + " and " + allowedRoles.at(-1)}s can access this page!`);
      return <Navigate to="/" replace />
    };

  return children;
}

// Use it like:
// <Route
//   path="/appointments"
//   element={
//     <ProtectedRoute allowedRoles={["patient"]}>
//       <MyAppointments />
//     </ProtectedRoute>
//   }
// />
